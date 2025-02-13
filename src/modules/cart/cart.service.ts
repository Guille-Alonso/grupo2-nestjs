import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { PrismaService } from '../prisma/prisma.service';


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
    let subtotal= 0;
    console.log(cart);
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
        console.log("dentro del for__->",carrito.id);
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
      return newCart
    })
    const datita = this.recoverCartData(newCart.id);
    return datita
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: string) {
    return `This action returns a #${id} cart`;
  }

  update(id: String, updateCartDto: CreateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: String) {
    return `This action removes a #${id} cart`;
  }
}
