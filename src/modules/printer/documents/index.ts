import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';

const styles: StyleDictionary ={
    header:{
        fontSize: 22,
        bold: true,
        color:'#521651',
    },
    subHeader:{
        fontSize:12,
        bold:true,
        color:'#525659'
    },
    productDetail:{
        fontSize:12,
        font:'Roboto',
        color:'#0a0a0a'
    }
}
interface TableContent {
    widths: string[];
    body: any[][]; 
    layout: string;
}

interface ContentItem {
    text?: string;
    style?: string;
    marginBottom?: number;
    table?: TableContent; 
    alignment?: string;
    marginTop?: number;
}

export const CarritoConfirmPdf = async (Carrito:any):Promise<TDocumentDefinitions>=>{

    const user = Carrito.user;
    const product = Carrito.cartLine;
    const fecha = `${Carrito.updatedAt.getDate()} / ${Carrito.updatedAt.getMonth()} / ${Carrito.updatedAt.getFullYear()}`

    
    const tableBody =[
        [
        {text:'Producto',
        style:'tableHeader'
         },
         {text:'Cantidad',
        style:'tableHeader'
        },
        {text:'Precio Unitario',
         style: 'tableHeader'
        },
        {text:'total',
         style:'tableHeader'
        }
        ]
    ];
    for (const elem of product) {
        const precioUnitario = elem.product.price;
        const cantidad = elem.quantity;
        const total = elem.total_price

        tableBody.push([
            { text: `${elem.product.name}, detalle: ${elem.product.description}`, style: 'tableCell' },
            { text: cantidad.toString(), style: 'tableCell' },
            { text: precioUnitario.toString(), style: 'tableCell' },
            { text: total.toString(), style: 'tableCell' }
        ]);
        }
    const contenido: ContentItem[] = [
        {
        text: '¡Gracias por tu compra!',
        style: 'header',
        marginBottom: 5
        },
        {
            text:`fecha: ${fecha} `,
            style:'subHeader',
            marginBottom:2
        },
        {
            text:`estimad@ ${user.name}, tu compra fue confirmada.`,
            style:'subHeader',
            marginBottom:2
        },
        {
            text:'detalle:',
            marginTop:5,
            marginBottom:10
        },
        {
            table: {
                widths: ['*', 'auto', 'auto', 'auto'],
                body: tableBody,
                layout: 'lightHorizontalLines',
            }
        },
        {
            text: `total General ${Carrito.totalAmount}`,
            alignment: 'right',
            marginTop:10,
            style: 'subHeader'
        }
    ]

    return{
        defaultStyle: {
            fontSize: 12,
            font: 'Arial',
            characterSpacing: -0.7,
            color: '#43484C',
          },
          pageSize: 'A4',
          pageMargins: [30, 25],
          content: contenido as any,
          styles: styles
        };
}
