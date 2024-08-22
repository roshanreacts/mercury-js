import { GraphQLError } from 'graphql';
import type { Mercury } from '../../mercury';
import puppeteer from 'puppeteer';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import nodemailer from 'nodemailer';


export const handleAddToCartForExistingCart = async (cartId: string, mercury: Mercury, user: any, productItem: string, priceBookItem: string, quantity: number, productPrice: number) => {
  const mercuryInstance = mercury.db
  if (!cartId) {
    throw new GraphQLError("Something went wrong")
  }
  const cartItem = await mercuryInstance.CartItem.get(
    {
      cart: cartId,
      productItem,
      priceBookItem,
    },
    user
  );
  const newQty = cartItem?.id ? (cartItem.quantity + quantity) : quantity;
  await mercuryInstance.CartItem.mongoModel.updateOne(
    {
      cart: cartId,
      productItem,
      priceBookItem,
    },
    {
      $set: {
        quantity: newQty,
        amount: (productPrice || 0) * newQty
      }
    },
    {
      upsert: true
    }
  );

  await recalculateTotalAmountOfCart(cartId, mercury, user)
}


export const recalculateTotalAmountOfCart = async (cart: any, mercury: Mercury, user: any) => {
  const cartItems = await mercury.db.CartItem.list({ cart }, user);
  const totalAmount = cartItems.reduce((amount: number, item: any) => amount + item.amount, 0);
  await mercury.db.Cart.update(cart, { totalAmount }, user);
}

export const syncAddressIsDefault = async (
  customer: string,
  mercury: Mercury,
  user: any
) => {
  const mercuryInstance = mercury.db;
  const existingDefaultAddress = await mercuryInstance.Address.get(
    {
      customer: customer,
      isDefault: true,
    },
    user
  );
  if (existingDefaultAddress.id) {
    await mercuryInstance.Address.update(
      existingDefaultAddress,
      { isDefault: false },
      user,
      { skipHook: true }
    );
  }
};

export const generatePDF = async (htmlContent: any) => {
  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  await page.addScriptTag({ url: "https://cdn.tailwindcss.com" })
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdfBuffer;
};


export const uploadToCloudinary = async (pdfBuffer: any, invoiceId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ folder: 'invoice' }, (error: any, result: unknown) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(pdfBuffer);
  });
};

export const uploadPdfBuffer = async (buffer: any) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'invoices' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
const getTransporter = (senderEmail?: string, password?: string) => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: senderEmail,
      pass: password,
    },
  });
};
export const sendVerificationEmail = async (email: string, invoice: string, senderEmail?: string, password?: string) => {
  const transporter = getTransporter(senderEmail, password);
  const mailOptions = {
    from: senderEmail,
    to: email,
    subject: 'Order Confirmation',
    text: `Your OrderInvoice ${invoice}`,
  };
  const info = await transporter.sendMail(mailOptions);
};

export const getInvoiceHtml = async (invoice: string, mercury: Mercury, user: any, order: string) => {
  const invoiceData: any = await mercury.db.Invoice.get({ _id: invoice }, user, {
    populate: [
      {
        path: 'customer'
      },
      {
        path: "shippingAddress"
      },
      {
        path: "billingAddress"
      },
      {
        path: "payment"
      },
      {
        path: "invoiceLines",
        populate: [
          {
            path: 'productItem'
          }
        ]
      }
    ]
  });

  console.log(invoiceData);

  let html = `<!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>

      <body>
          <div className="bg-white text-black p-8 rounded-lg shadow-lg">
              <div className="flex justify-center items-center mb-0">
                  <img src="https://www.slaycoffee.in/cdn/shop/files/logo.png?v=1714476294&width=240" className="w-50 h-50"
                      alt="image" />
              </div>
              <div className="mb-8 text-center">
                  <h1 className="text-2xl font-bold mb-2">Invoice</h1>
                  <p>Order #${order}</p>
                  <p>Placed on ${new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex justify-between mb-8">
                  <div>
                      <h2 className="text-lg font-semibold mb-4">Billed To</h2>
                      <p className="font-bold">${invoiceData?.shippingAddress?.name}</p>
                      <p>${invoiceData?.shippingAddress?.street}, ${invoiceData?.shippingAddress?.addressLine1}, </p>
                      <p>${invoiceData?.shippingAddress?.addressLine2}, ${invoiceData?.shippingAddress?.landmark}, </p>
                      <p>${invoiceData?.shippingAddress?.city}, ${invoiceData?.shippingAddress?.state}, ${invoiceData?.shippingAddress?.zipCode}</p>
                      <p>${invoiceData?.shippingAddress?.zipCode}, Mobile: ${invoiceData?.shippingAddress?.mobile} </p>
                  </div>
                  <div>
                      <h2 className="text-lg font-semibold mb-4">Shipped To</h2>
                      <p className="font-bold">${invoiceData?.billingAddress?.name}</p>
                      <p>${invoiceData?.billingAddress?.street}, ${invoiceData?.billingAddress?.addressLine1}, </p>
                      <p>${invoiceData?.billingAddress?.addressLine2}, ${invoiceData?.billingAddress?.landmark}, </p>
                      <p>${invoiceData?.billingAddress?.city}, ${invoiceData?.billingAddress?.state}, ${invoiceData?.billingAddress?.zipCode}</p>
                      <p>${invoiceData?.billingAddress?.zipCode}, Mobile: ${invoiceData?.billingAddress?.mobile} </p>
                  </div>
                  <div>
                      <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
                      <p><span className="font-bold">Invoice #:</span> ${invoiceData.id}</p>
                      <p><span className="font-bold">Payment Status:</span> ${invoiceData?.payment?.status}</p>
                      <p><span className="font-bold">Fulfillment Status:</span> Fulfilled</p>
                  </div>
              </div>

              <div className="border-t border-gray-300 my-4"></div>

              <div>
                  <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                  <div className="grid grid-cols-5 gap-4 font-bold text-gray-600">
                      <span>Product</span>
                      <span>Price</span>
                      <span>Quantity</span>
                      <span>Total</span>
                  </div>`

  invoiceData?.invoiceLines?.map((item: any) => {
    html += `<div className="grid grid-cols-5 gap-4 mb-4">
                    <span className="text-blue-500">${item?.productItem?.name}</span>
                    <span>₹ ${item?.pricePerUnit}</span>
                    <span>${item?.quantity}</span>
                    <span>₹ ${item?.amount}</span>
                </div>`})
  html += `</div>
              <div className="border-t border-gray-300 my-4"></div>

              <div className="flex justify-between mb-4">
                  <span className="font-semibold">Subtotal</span>
                  <span>₹ ${invoiceData?.total}</span>
              </div>
              <div className="flex justify-between mb-4">
                  <span className="font-semibold">Shipping</span>
                  <span>₹ 0</span>
              </div>
              <div className="flex justify-between mb-4">
                  <span className="font-semibold">Tax (CGST 2.5%)</span>
                  <span>₹ 0</span>
              </div>
              <div className="flex justify-between mb-4">
                  <span className="font-semibold">Tax (IGST 2.5%)</span>
                  <span>₹ 0</span>
              </div>

              <div className="border-t border-gray-300 my-4"></div>

              <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹ ${invoiceData?.total}</span>
              </div>
          </div>
      </body>

      </html>`

  console.log(html, "Htmlcontent");

  return html;
}