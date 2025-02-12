import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from 'node-mailjet';



@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService){}
 
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
    try{

      let subtotal= 0;
      
      for (const product of cart.cartLine){
        const total = product.quantity * product.unit_price;
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
            
            throw new Error('no products exist')
            
          }
          let totalPrice = product.quantity *product.unit_price;
          await tx.cartLine.create({
            data:{
              cartId: carrito.id,
              productId: product.productId,
              quantity: product.quantity,
              unit_price: product.unit_price,
              total_price: totalPrice
            }
          })
        }
        return carrito
      })
      
      return {Message: 'carrito', newCart}
    }catch(e){
      throw new Error(e.message)
    }
  }

  async findAll() {
    try{
      const datacart = await this.prisma.cart.findMany({
        where:{
            
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
            }
          })
          if(!datacart){
            throw new Error('no se encontraron datos')
          }
          return datacart
    }catch(e){
      throw new Error(e.message)
    }
  }

  findOne(id: string) {
    try{
      const datita =this.recoverCartData(id); 
      return datita;
    }catch(e){
      throw new Error(e)
    }
  }

  async comfirmCart(id: string) {
    try{
      
      const confCart = this.prisma.$transaction(async (tx)=>{
          const carrito = await tx.cart.findUnique({
            where:{
              id,
              state:"PENDING"
            },
            include:{cartLine:{include:{product:true}}}
          })

          if(!carrito){
            throw new Error('cart no find')
          }
          await tx.cart.update({
          where:{
            id
          },
          data:{
            state:"CONFIRMED"
          }
        })
       
        const productCart = carrito.cartLine; 

       for (const line of productCart) {
        await tx.product.update({ 
      where: { id: line.product.id },
      data: {
        stock: {
          decrement: line.quantity
        }
      }
    });
     }

      return {confCart}
      })

    }catch(e){
      throw new Error(e.message)
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
      throw new Error('cart confirm')
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
  return {Message: 'carrito cancelado'}
   }catch(e){
    throw new Error(e.message)
   }
  }
}
