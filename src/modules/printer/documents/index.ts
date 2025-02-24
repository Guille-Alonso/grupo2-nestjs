import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';

const styles: StyleDictionary ={
    header:{
        fontSize: 22,
        bold: true,
        color:'#521651',
    },
    subHeader:{
        fontSize:18,
        bold:true,
        color:'#525659'
    },
    productDetail:{
        fontSize:12,
        font:'Roboto',
        color:'#0a0a0a'
    }
}

export const CarritoConfirmPdf = async (Carrito:any):Promise<TDocumentDefinitions>=>{

    const user = Carrito.user;
    const product = Carrito.cartLine;
    let productos = [];
    
    for(const elem of product){
        const details = `${elem.product.name}, Cantidad: ${elem.quantity}, Precio: ${elem.product.price}`
        productos.push(details)
    }

    const contenido = [
        {
        text: 'Gracias por tu compra',
        styles: 'header',
        marginBottom: 2
        },
        {
            text:`estimad@ ${user.name}, tu compra fue confirmada.`,
            styles:'subHeader',
            marginBottom:2
        },
        {
            text:'Productos:',
            marginBottom:10
        },
        ...productos.map(product =>({
            text: `${product}`,
            marginBottom: 5
        }))
    ]

    return{
        defaultStyle: {
            fontSize: 10,
            font: 'Arial',
            characterSpacing: -0.7,
            color: '#43484C',
          },
          pageSize: 'A4',
          pageMargins: [30, 25],
          content: contenido,
          styles: styles
        };
}
