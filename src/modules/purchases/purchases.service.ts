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
      
        const newPurchase = await this.prisma.$transaction(async (tx)=>{
              const purchase = await tx.purchase.create({
                data:{
                  userId
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
                      purchaseId: purchase.id
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
                      productId: newProduct.id
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
      select:{
        user:{
          select:{
            name:true,
            password:true
          }
        },
        products:{
          select:{
            product:true
          }
        }
      }
    }) 
    return datita;
  }



  
}
