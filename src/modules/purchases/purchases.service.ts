import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';



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
        return{Message: this.i18n.t('messages.opConfirm'), newPurchase}
    }catch(e){
      throw new Error(e +" "+HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(userId) {
    try{

      const datita = await this.prisma.purchase.findMany({
        where:{
          userId
        },
        include:{user:true, products:{include:{product:true}}}
        
      }) 
      const setear = []
      for(const purchases of datita){
        const purchaseData = {
          userId: purchases.user.id,
          users: purchases.user.name + " "+ purchases.user.lastName,
          fecha:  purchases.createdAt.getDate()+"-"+purchases.createdAt.getMonth()+"-"+purchases.createdAt.getFullYear(),
          hora: purchases.createdAt.getHours()+":"+purchases.createdAt.getMinutes()+":"+ purchases.createdAt.getSeconds(),
          total: purchases.total,
          products:[]
        }
        
        for(const Prod of purchases.products){
          let product = 'productId: '+ Prod.product.id+', quantity: '+ Prod.quantity + ', product name: ' + Prod.product.name + ', product price: ' + Prod.product.price + '.'
          purchaseData.products.push(
            product
          )
        }
        setear.push(purchaseData)
      }
      return setear
    }catch(e){
      throw new Error(e +" "+HttpStatus.BAD_REQUEST)
    }
  }



  
}
