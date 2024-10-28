import emailjs from "emailjs-com";
import { Order } from "./slices/orderSlice";
import { Product } from "./slices/productSlice";

export const sendOrderConfirmationWithLink = (
  order: Order,
  products: Product[]
) => {
  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };
  const shippingAddress = order.shippingAddress || "Hämtas upp på plats";
  const pickUpAdress = "Vävlagargatan 6p, 507 30 Brämhult";

  const itemsList = order.items
    .map((i) => {
      const item = getProduct(i.product_id);
      if (!item) return "";
      return `
        <li>
          ${item.name} (${item.id}) - ${i.quantity} st / ${(
        (item.price * i.quantity) /
        100
      ).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const addressSection = `
    <p><strong>${
      order.shippingMethod === "shipping"
        ? "Leveransadress:"
        : "Hämta upp ordern på:"
    }</strong> ${
    order.shippingMethod === "shipping" ? shippingAddress : pickUpAdress
  }</p>
  `;

  const receipt = `
    <h4>Tack för ditt köp!</h4>
    <p><strong>Beställning nr:</strong> ${order.reference}</p>
    <p><strong>Leverans:</strong> ${
      order.shippingMethod === "shipping"
        ? "Leverans till hemmet"
        : "Hämtas upp på plats"
    }</p>
    ${addressSection}

    
    <h3>Dina beställningsdetaljer:</h3>
    <ul>
      ${itemsList}
    </ul>

    <h4>Betalsätt:</h4>
    <p>${order.paymentInfo?.instrument}</p>
    <p><strong>Totalt belopp: ${(order.total_amount / 100).toFixed(
      2
    )} SEK</strong></p>
    <p>Vid frågor, tveka inte att kontakta oss på <a href="mailto:denthu.webbshop@outlook.com">denthu.webbshop@outlook.com</a>!</p>
    
    <footer>
      <p>Hälsningar,<br />DenThu Webbshop</p>
      <p>Följ oss på sociala medier: 
        <a href="https://www.instagram.com/denthu">Instagram</a>,
        <a href="https://www.facebook.com/denthu">Facebook</a>
      </p>
    </footer>
  `;

  const templateParams = {
    from_name: "DenThu",
    to_email: order.guestEmail,
    order_number: order.reference,
    store_name: "DenThu Webbshop",
    reply_to: "denthu.webbshop@outlook.com",
    message: receipt,
  };

  emailjs
    .send("service_9phhhzn", "template_d2buzz5", templateParams)
    .then((response) => {
      console.log("Email sent successfully!", response);
    })
    .catch((error) => {
      console.error("Failed to send email. Error: ", error);
    });
};

export const sendEmailOrderSent = (order: Order, products: Product[]) => {
  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };

  const shippingAddress = order.shippingAddress || "Hämtas upp på plats";

  // HÄR SKA DET VARA ORDER.SHIPPINGDATE
  const deliveryDate = new Date(order.created_date).toLocaleDateString(
    "sv-SE",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const itemsList = order.items
    .map((i) => {
      const item = getProduct(i.product_id);
      if (!item) return "";
      return `
        <li>
          ${item.name} (${item.id}) - ${i.quantity} st / ${(
        (item.price * i.quantity) /
        100
      ).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const receipt = `
    <h4>Din beställning har skickats!</h4>
    <p><strong>Beställning nr:</strong> ${order.reference}</p>
    <p><strong>Du kommer att få din försändelse:</strong></p>
    <p><strong>Förväntad leverans:</strong> ${deliveryDate}</p>
    <p><strong>Leveransmetod:</strong> ${
      order.shippingMethod === "shipping"
        ? "Standardleverans till hemmet"
        : "Hämtas upp på plats"
    }</p>
    <p><strong>Leveransadress:</strong> ${shippingAddress}</p>
    
    <h3>Dina beställningsdetaljer:</h3>
    <ul>
      ${itemsList}
    </ul>

    <h4>Namnteckning vid leverans:</h4>
    <p>Nej</p>

    <h4>Betalsätt:</h4>
    <p>${order.paymentInfo?.instrument}</p>
    
    <h4>Elektroniskt kvitto:</h4>
    <p>Vi bifogar det elektroniska kvittot. Med det kan du göra byten eller returer. Om du går till butiken kan du visa upp det på din mobilskärm.</p>
    
    <p>Vid frågor, tveka inte att kontakta oss på <a href="mailto:denthu.webbshop@outlook.com">denthu.webbshop@outlook.com</a>!</p>
    
    <footer>
      <p>Hälsningar,<br />DenThu Webbshop</p>
      <p>Följ oss på sociala medier: 
        <a href="https://www.instagram.com/denthu">Instagram</a>,
        <a href="https://www.facebook.com/denthu">Facebook</a>
      </p>
    </footer>
  `;

  const templateParams = {
    from_name: "DenThu",
    to_email: "denthu.webbshop@outlook.com",
    order_number: order.reference,
    store_name: "DenThu Webbshop",
    reply_to: "denthu.webbshop@outlook.com",
    message: receipt,
  };

  emailjs
    .send("service_9phhhzn", "template_d2buzz5", templateParams)
    .then((response) => {
      console.log("Email sent successfully!", response);
    })
    .catch((error) => {
      console.error("Failed to send email. Error: ", error);
    });
};

export const sendEmailOrderPickedUp = (order: Order, products: Product[]) => {
  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };

  const shippingAddress = order.shippingAddress || "Hämtas upp på plats";

  const itemsList = order.items
    .map((i) => {
      const item = getProduct(i.product_id);
      if (!item) return "";
      return `
        <li>
          ${item.name} (${item.id}) - ${i.quantity} st / ${(
        (item.price * i.quantity) /
        100
      ).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const receipt = `
    <h4>Din beställning har hämtats upp!</h4>
    <p><strong>Beställning nr:</strong> ${order.reference}</p>
    <p><strong>Leveransmetod:</strong> ${
      order.shippingMethod === "shipping"
        ? "Standardleverans till hemmet"
        : "Hämtas upp på plats"
    }</p>
    <p><strong>Leveransadress:</strong> ${shippingAddress}</p>
    
    <h3>Dina beställningsdetaljer:</h3>
    <ul>
      ${itemsList}
    </ul>

    <h4>Namnteckning vid leverans:</h4>
    <p>Nej</p>

    <h4>Betalsätt:</h4>
    <p>${order.paymentInfo?.instrument}</p>
    
    <h4>Elektroniskt kvitto:</h4>
    <p>Vi bifogar det elektroniska kvittot. Med det kan du göra byten eller returer. Om du går till butiken kan du visa upp det på din mobilskärm.</p>
    
    <p>Vid frågor, tveka inte att kontakta oss på <a href="mailto:denthu.webbshop@outlook.com">denthu.webbshop@outlook.com</a>!</p>
    
    <footer>
      <p>Hälsningar,<br />DenThu Webbshop</p>
      <p>Följ oss på sociala medier: 
        <a href="https://www.instagram.com/denthu">Instagram</a>,
        <a href="https://www.facebook.com/denthu">Facebook</a>
      </p>
    </footer>
  `;

  const templateParams = {
    from_name: "DenThu",
    to_email: "denthu.webbshop@outlook.com",
    order_number: order.reference,
    store_name: "DenThu Webbshop",
    reply_to: "denthu.webbshop@outlook.com",
    message: receipt,
  };

  emailjs
    .send("service_9phhhzn", "template_d2buzz5", templateParams)
    .then((response) => {
      console.log("Email sent successfully!", response);
    })
    .catch((error) => {
      console.error("Failed to send email. Error: ", error);
    });
};

export const sendNewOrderNotificationToDenthu = (
  order: Order,
  products: Product[]
) => {
  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };

  const shippingAddress = order.shippingAddress || "Hämtas upp på plats";

  const itemsList = order.items
    .map((i) => {
      const item = getProduct(i.product_id);
      if (!item) return "";
      return `
        <li>
          ${item.name} (${item.id}) - ${i.quantity} st / ${(
        (item.price * i.quantity) /
        100
      ).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const orderInfo = `
    <h4>Ny order mottagen!</h4>
    <p><strong>Beställning nr:</strong> ${order.reference}</p>
    <p><strong>Kundens email:</strong> ${order.guestEmail}</p>
    <p><strong>Leveransmetod:</strong> ${
      order.shippingMethod === "shipping"
        ? "Standardleverans till hemmet"
        : "Hämtas upp på plats"
    }</p>
    <p><strong>Leveransadress:</strong> ${shippingAddress}</p>
    
    <h3>Beställningsdetaljer:</h3>
    <ul>
      ${itemsList}
    </ul>

    <p><strong>Totalt belopp: ${(order.total_amount / 100).toFixed(
      2
    )} SEK</strong></p>
  `;

  const templateParams = {
    from_name: "DenThu Webbshop",
    to_email: "denthu.webbshop@outlook.com", // Dennis' email
    order_number: order.reference,
    store_name: "DenThu Webbshop",
    reply_to: "denthu.webbshop@outlook.com",
    message: orderInfo,
  };

  emailjs
    .send("service_9phhhzn", "template_85vmukh", templateParams)
    .then((response) => {
      console.log("Notification sent to DenThu successfully!", response);
    })
    .catch((error) => {
      console.error("Failed to send notification. Error: ", error);
    });
};
