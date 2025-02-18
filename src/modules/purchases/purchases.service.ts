import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { MessagingService } from '../messanging/messanging.service';


@Injectable()
export class PurchasesService {
  constructor(private readonly prisma : PrismaService,
    private readonly i18n: I18nService
  ){}

  async create(createPurchaseDto: CreatePurchaseDto, userId) {
    
    try{
      let total=0;
      for(const produ of createPurchaseDto.productPurchase){
        total =total + produ.product.stock * produ.product.price
      }

        const newPurchase = await this.prisma.$transaction(async (tx)=>{
              const purchase = await tx.purchase.create({
                data:{
                  userId,
                  total
                }
              })
              
              for (const product of createPurchaseDto.productPurchase){
                
                const exist = await tx.product.findFirst({
                  where:{
                    OR:[
                      {name: product.product.name},
                      {barcode: product.product.barcode}
                    ]
                  }
                })
                if(exist){
                  await tx.product.update({
                    where:{
                      id: exist.id,
                    },
                    data:{
                      stock: {increment:product.product.stock}
                    }
                  })

                  await tx.productPurchase.create({
                    data:{
                      productId: exist.id,
                      purchaseId: purchase.id,
                      quantity: product.product.stock
                    }
                  })
                  
                }else{
                  const {name, description,price,stock,barcode,sku} = product.product;
                  const newProduct = await tx.product.create({
                    data:{
                      name, description,price,stock,barcode,sku
                    }
                  })

                  tx.productPurchase.create({
                    data:{
                      purchaseId: purchase.id,
                      productId: newProduct.id,
                      quantity:  product.product.stock
                    }
                  })
                  
                }
              }
            })
        return{Message: 'operacion exitosa', newPurchase}
    }catch(e){
      throw new Error(e)
    }
  }

  async findAll(userId) {
    const datita = await this.prisma.purchase.findMany({
      where:{
        userId
      },
      include:{user:true, products:{include:{product:true}}}
     
    }) 
    return datita
    for(const purchases of datita){
      const setear = [
        {
          "usuario": purchases.user.name,
          "fecha":  purchases.createdAt.getDate(),
          "hora": purchases.createdAt.getTime()

        }
      ]
    }
  }



  
}
