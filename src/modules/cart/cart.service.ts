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
        const extiste = await tx.product.findUnique({
          where:{
            id: product.productId
          }
        })
        if(!extiste){
          return {Message: "producto no exite"}
          
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
  }

  findAll() {
    return "a";
  }

  findOne(id: string) {
    const datita =this.recoverCartData(id); 
    return datita;
  }

  update(id: String, updateCartDto: CreateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: String) {
    return `This action removes a #${id} cart`;
  }
}
