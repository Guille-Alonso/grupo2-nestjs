import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { I18nService } from 'nestjs-i18n';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PrinterService } from '../printer/printer.service';
import { CarritoConfirmPdf} from '../printer/documents';




@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService,
    private readonly i18n:I18nService,
    private readonly paginationService:PaginationService,
    private readonly printerService : PrinterService,
  ){}
 
  async recoverCartData (cartId: string){
    const cartData = await this.prisma.cart.findUnique({
      where:{
        id: cartId,
        isDeleted: false
      },
      select:{
        totalAmount:true,
        state: true,
        user:{
          select:{
            name:true,
            email:true,
          }
        },
        cartLine:{
          select:{
            unit_price:true,
            total_price:true,
            quantity: true,
            product:{
              select:{
                name:true,
                description:true
              }
            }
          }
        }
      }
    })
    return cartData
  }



  async create(cart: CreateCartDto) {
    console.log(cart);
    try{

      let subtotal= 0;
      
      for (const product of cart.cartLine){
        const prod = await this.prisma.product.findUnique({
          where:{
            id: product.productId
          }
        })
        const total = product.quantity * prod.price;
        subtotal = subtotal + total
      }
      console.log(subtotal);
  
      const newCart = await this.prisma.$transaction(async (tx)=>{
        const carrito = await tx.cart.create({
          data:{
            userId: cart.userId,
            totalAmount:subtotal
          }
        });
        
        
        for (const product of cart.cartLine){
          const exist = await tx.product.findUnique({
            where:{
              id: product.productId
            }
          })
          if(!exist){
            throw new Error(this.i18n.t('messages.productNotFound') + HttpStatus.BAD_REQUEST)
          }
          let totalPrice = product.quantity * exist.price;
          await tx.cartLine.create({
            data:{
              cartId: carrito.id,
              productId: product.productId,
              quantity: product.quantity,
              unit_price: exist.price,
              total_price: totalPrice
            }
          })
        }
        return carrito
      })
      
      return {newCart}
    }catch(e){
      throw new Error(e.message + HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(userId, paginationDto2) {
    
    try{
      const {page,pageSize,sortBy,sortOrder}=paginationDto2;
      const {skip, take, orderBy}= this.paginationService.getPaginationParams(
        page, pageSize, sortBy, sortOrder
      )
      const [data, total] = await Promise.all([
       this.prisma.cart.findMany({
        where:{
              userId,
              isDeleted:false
            },
            select:{
              id: true,
              totalAmount:true,
               user:{
                select:{
                  name:true,
                  email:true,
                }
              },
              cartLine:{
                select:{
                  quantity:true,
                  unit_price:true,
                  total_price:true,
                  product:{
                    select:{
                      name:true,
                      description:true,
                    }
                  }
                }
              }
            },
            skip,
            take,
            orderBy
          }),
          this.prisma.cart.count()
        ])
        if (data.length === 0){
            throw new Error(this.i18n.t('messages.cartsNotFind') + HttpStatus.BAD_REQUEST)
          }
          return this.paginationService.formatPaginatedResponse(data,total,page,pageSize)
    }catch(e){
      const message = this.i18n.t('messages.cartsNotFind') + e;
      throw new Error(message)
    }
  }

  async findAllAdmin(paginationDto2: PaginationDto2){
    try{
      const {page, pageSize, sortBy, sortOrder}=paginationDto2;
      const {skip, take, orderBy}= this.paginationService.getPaginationParams(
        page, pageSize, sortBy, sortOrder
      )
      const [data, total] = await Promise.all([
       this.prisma.cart.findMany({
            select:{
              id: true,
              totalAmount:true,
              state:true,
               user:{
                select:{
                  name:true,
                  email:true,
                }
              },
              cartLine:{
                select:{
                  quantity:true,
                  unit_price:true,
                  total_price:true,
                  product:{
                    select:{
                      name:true,
                      description:true,
                    }
                  }
                }
              }
            },
            skip,
            take,
            orderBy
          }),
          this.prisma.cart.count()
        ])
        if (data.length === 0){
          throw new Error(this.i18n.t('messages.cartsNotFind') + HttpStatus.BAD_REQUEST)
        }
        return this.paginationService.formatPaginatedResponse(data,total,page,pageSize)
    }catch(e){
      const message = this.i18n.t('messages.cartsNotFind') +" "+e;
      throw new Error(message)
    }
  }

  findOne(id: string) {
    try{
      const datita =this.recoverCartData(id); 
      if (!datita){
        throw new Error(this.i18n.t('messages.cartNotFind'))
      }
      return datita;
    }catch(e){
      throw new Error(e)
    }
  }

  async comfirmCart(id: string): Promise<Buffer> {

    console.log(id);
    
    try {
      const carrito = await this.prisma.cart.findUnique({
          where: { id, state: "PENDING" },
          include: {user:true, cartLine: { include: { product: true }, } },
      });

      if (!carrito) {
          throw new Error(this.i18n.t('messages.cartsNotFind')); 
      }
     await this.prisma.$transaction(async (tx) => {
            
            const productCart = carrito.cartLine;

            for (const line of productCart) {
                const productStock = await tx.product.findUnique({
                    where: { id: line.product.id },
                    select: { stock: true },
                });

                if (productStock.stock < line.quantity || productStock.stock == 0) {
                    throw new Error(this.i18n.t('messages.prod') + line.product.name + this.i18n.t('messages.notAvailable')); 
                }

                await tx.product.update({
                    where: { id: line.product.id },
                    data: { stock: { decrement: line.quantity } },
                });

            }

            await tx.cart.update({
                where: { id },
                data: { state: "CONFIRMED" },
            });
          });
          const pdfConfirm = await CarritoConfirmPdf(carrito);
          const pdfDoc = await this.printerService.createPdf(pdfConfirm);
          return pdfDoc;  

    } catch (e) {
        if (e.message === 'cart no find') {
            throw new NotFoundException(e.message); 
        } else if (e.message.startsWith('producto ')) {
            throw new BadRequestException(e.message);
        } else {
            Logger.error(e); 
            throw new InternalServerErrorException(this.i18n.t('noConfirmCart'));
        }
    }
}
  
  async remove(id: string) {
   try{
    const carrito = await this.prisma.cart.findUnique({
      where:{
        id,
        state:"PENDING",
      },
    })

    if(!carrito){
      throw new Error(this.i18n.t('confirmCart'))
    }
    await this.prisma.cart.update({
    where:{
      id,
      state:"PENDING"
    },
    data:{
      state:"CANCELLED"
    }
  })
  return {Message: this.i18n.t('cartCancel')}
   }catch(e){
    throw new Error(e.message)
   }
  }
}
