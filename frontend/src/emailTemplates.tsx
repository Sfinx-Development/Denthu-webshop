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
        <li style="margin: 5px 0; font-size: 14px;">
          <span style="font-weight: bold;">${item.name}</span> - 
          ${i.quantity} st / ${(item.price * i.quantity).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const addressSection = `
    <p style="font-size: 16px;">
      <strong>${
        order.shippingMethod === "shipping"
          ? "Leveransadress:"
          : "Hämta upp ordern på:"
      }</strong>
      ${order.shippingMethod === "shipping" ? shippingAddress : pickUpAdress}
    </p>
  `;

  const receipt = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
        <h2 style="color: #007BFF;">Tack för din beställning!</h2>
        <p><strong>Beställning nr:</strong> ${order.reference}</p>
        <p><strong>Leverans:</strong> ${
          order.shippingMethod === "shipping"
            ? "Leverans till hemmet"
            : "Hämtas upp på plats"
        }</p>
        ${addressSection}

        <h3 style="margin-top: 20px; color: #555;">Dina beställningsdetaljer:</h3>
        <ul style="padding: 0 0 0 20px; margin: 0; list-style-type: disc;">
          ${itemsList}
        </ul>

        <h4 style="margin-top: 20px; color: #555;">Betalsätt:</h4>
        <p>${order.paymentInfo?.instrument}</p>
        <p style="font-size: 18px; font-weight: bold;">
          Totalt belopp: ${(order.total_amount / 100).toFixed(2)} SEK
        </p>
        <p>
          Vid frågor, tveka inte att kontakta oss på 
          <a href="mailto:denthu.webbshop@outlook.com" style="color: #007BFF;">
            denthu.webbshop@outlook.com
          </a>!
        </p>
      </div>

      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
        <p>Hälsningar,<br />DenThu Webbshop</p>
        <p>
          Följ oss på sociala medier: 
          <a href="https://www.instagram.com/denthu" style="color: #007BFF;">Instagram</a>, 
          <a href="https://www.facebook.com/denthu" style="color: #007BFF;">Facebook</a>
        </p>
      </footer>
    </div>
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

export const sendOrderCancelledWithLink = (
  order: Order,
  products: Product[]
) => {
  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };

  const itemsList = order.items
    .map((i) => {
      const item = getProduct(i.product_id);
      if (!item) return "";
      return `
        <li style="margin: 5px 0; font-size: 14px;">
          <span style="font-weight: bold;">${item.name}</span> - 
          ${i.quantity} st / ${(item.price * i.quantity).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const receipt = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #fff3f3; padding: 20px; border-radius: 8px; border: 1px solid #ff4d4d;">
        <h2 style="color: #ff4d4d;">Din betalning är avbruten!</h2>
        <p><strong>Beställning nr:</strong> ${order.reference}</p>
        
        <h3 style="margin-top: 20px; color: #555;">Dina beställningsdetaljer:</h3>
        <ul style="padding: 0 0 0 20px; margin: 0; list-style-type: disc;">
          ${itemsList}
        </ul>

        <h4 style="margin-top: 20px; color: #555;">Betalsätt:</h4>
        <p>${order.paymentInfo?.instrument}</p>
        <p style="font-size: 18px; font-weight: bold;">
          Totalt belopp: ${(order.total_amount / 100).toFixed(2)} SEK
        </p>
        <p>
          Vid frågor, tveka inte att kontakta oss på 
          <a href="mailto:denthu.webbshop@outlook.com" style="color: #007BFF;">
            denthu.webbshop@outlook.com
          </a>!
        </p>
      </div>

      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
        <p>Hälsningar,<br />DenThu Webbshop</p>
        <p>
          Följ oss på sociala medier: 
          <a href="https://www.instagram.com/denthu" style="color: #007BFF;">Instagram</a>, 
          <a href="https://www.facebook.com/denthu" style="color: #007BFF;">Facebook</a>
        </p>
      </footer>
    </div>
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

export const sendOrderReversedWithLink = (
  order: Order,
  products: Product[]
) => {
  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };

  const itemsList = order.items
    .map((i) => {
      const item = getProduct(i.product_id);
      if (!item) return "";
      return `
        <li style="margin: 5px 0; font-size: 14px;">
          <span style="font-weight: bold;">${item.name}</span> - 
          ${i.quantity} st / ${(item.price * i.quantity).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const receipt = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f7f9fc; padding: 20px; border-radius: 8px; border: 1px solid #6c757d;">
        <h2 style="color: #ff6f61;">Din betalning är återkallad!</h2>
        <p><strong>Beställning nr:</strong> ${order.reference}</p>
        
        <h3 style="margin-top: 20px; color: #555;">Dina beställningsdetaljer:</h3>
        <ul style="padding: 0 0 0 20px; margin: 0; list-style-type: disc;">
          ${itemsList}
        </ul>

        <h4 style="margin-top: 20px; color: #555;">Betalsätt:</h4>
        <p>${order.paymentInfo?.instrument}</p>
        <p style="font-size: 18px; font-weight: bold;">
          Totalt belopp: ${(order.total_amount / 100).toFixed(2)} SEK
        </p>
        <p>
          Vid frågor, tveka inte att kontakta oss på 
          <a href="mailto:denthu.webbshop@outlook.com" style="color: #007BFF;">
            denthu.webbshop@outlook.com
          </a>!
        </p>
      </div>

      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
        <p>Hälsningar,<br />DenThu Webbshop</p>
        <p>
          Följ oss på sociala medier: 
          <a href="https://www.instagram.com/denthu" style="color: #007BFF;">Instagram</a>, 
          <a href="https://www.facebook.com/denthu" style="color: #007BFF;">Facebook</a>
        </p>
      </footer>
    </div>
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

export const sendOrderConfirmationShipped = (
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
        <li style="margin: 5px 0; font-size: 14px;">
          <span style="font-weight: bold;">${item.name}</span> - 
          ${i.quantity} st / ${(item.price * i.quantity).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const addressSection = `
    <p style="font-size: 16px;">
      <strong>${
        order.shippingMethod === "shipping"
          ? "Leveransadress:"
          : "Hämta upp ordern på:"
      }</strong>
      ${order.shippingMethod === "shipping" ? shippingAddress : pickUpAdress}
    </p>
  `;

  const receipt = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; border: 1px solid #007BFF;">
        <h4 style="color: #007BFF;">Din order har skickats!</h4>
        <p><strong>Beställning nr:</strong> ${order.reference}</p>
        ${addressSection}
        <p><strong>Spårningslänk:</strong> 
          <a href="${
            order.trackingLink
          }" style="color: #007BFF;" target="_blank">
            Klicka här för att följa din leverans
          </a>
        </p>
        
        <h3 style="margin-top: 20px; color: #555;">Dina beställningsdetaljer:</h3>
        <ul style="padding: 0 0 0 20px; margin: 0; list-style-type: disc;">
          ${itemsList}
        </ul>

        <h4 style="margin-top: 20px; color: #555;">Betalsätt:</h4>
        <p>${order.paymentInfo?.instrument}</p>
        <p style="font-size: 18px; font-weight: bold;">
          Totalt belopp: ${(order.total_amount / 100).toFixed(2)} SEK
        </p>
        <p>
          Vid frågor, tveka inte att kontakta oss på 
          <a href="mailto:denthu.webbshop@outlook.com" style="color: #007BFF;">
            denthu.webbshop@outlook.com
          </a>!
        </p>
      </div>

      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
        <p>Hälsningar,<br />DenThu Webbshop</p>
        <p>
          Följ oss på sociala medier: 
          <a href="https://www.instagram.com/denthu" style="color: #007BFF;">Instagram</a>, 
          <a href="https://www.facebook.com/denthu" style="color: #007BFF;">Facebook</a>
        </p>
      </footer>
    </div>
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

export const sendOrderConfirmationPickedUp = (
  order: Order,
  products: Product[]
) => {
  const getProduct = (productId: string): Product | undefined => {
    return products.find((p) => p.id == productId);
  };

  const itemsList = order.items
    .map((i) => {
      const item = getProduct(i.product_id);
      if (!item) return "";
      return `
        <li style="margin: 5px 0; font-size: 14px;">
          <span style="font-weight: bold;">${item.name}</span> - 
          ${i.quantity} st / ${(item.price * i.quantity).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const receipt = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #f9fff3; padding: 20px; border-radius: 8px; border: 1px solid #28a745;">
        <h4 style="color: #28a745;">Din order har hämtats upp!</h4>
        <p><strong>Beställning nr:</strong> ${order.reference}</p>

        <h3 style="margin-top: 20px; color: #555;">Dina beställningsdetaljer:</h3>
        <ul style="padding: 0 0 0 20px; margin: 0; list-style-type: disc;">
          ${itemsList}
        </ul>

        <h4 style="margin-top: 20px; color: #555;">Betalsätt:</h4>
        <p>${order.paymentInfo?.instrument}</p>
        <p style="font-size: 18px; font-weight: bold;">
          Totalt belopp: ${(order.total_amount / 100).toFixed(2)} SEK
        </p>
        <p>
          Vid frågor, tveka inte att kontakta oss på 
          <a href="mailto:denthu.webbshop@outlook.com" style="color: #007BFF;">
            denthu.webbshop@outlook.com
          </a>!
        </p>
      </div>

      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
        <p>Hälsningar,<br />DenThu Webbshop</p>
        <p>
          Följ oss på sociala medier: 
          <a href="https://www.instagram.com/denthu" style="color: #007BFF;">Instagram</a>, 
          <a href="https://www.facebook.com/denthu" style="color: #007BFF;">Facebook</a>
        </p>
      </footer>
    </div>
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
        <li style="margin: 5px 0; font-size: 14px;">
          <span style="font-weight: bold;">${item.name}</span> - 
          ${i.quantity} st / ${(item.price * i.quantity).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const receipt = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; border: 1px solid #007BFF;">
        <h2 style="color: #007BFF;">Din beställning har skickats!</h2>
        <p><strong>Beställning nr:</strong> ${order.reference}</p>
        <p><strong>Förväntad leverans:</strong> ${deliveryDate}</p>
        <p><strong>Leveransmetod:</strong> ${
          order.shippingMethod === "shipping"
            ? "Standardleverans till hemmet"
            : "Hämtas upp på plats"
        }</p>
        <p><strong>Leveransadress:</strong> ${shippingAddress}</p>
        
        <h3 style="margin-top: 20px; color: #555;">Dina beställningsdetaljer:</h3>
        <ul style="padding: 0 0 0 20px; margin: 0; list-style-type: disc;">
          ${itemsList}
        </ul>

        <h4 style="margin-top: 20px; color: #555;">Namnteckning vid leverans:</h4>
        <p>Nej</p>

        <h4 style="margin-top: 20px; color: #555;">Betalsätt:</h4>
        <p>${order.paymentInfo?.instrument}</p>
        
        <h4 style="margin-top: 20px; color: #555;">Elektroniskt kvitto:</h4>
        <p>
          Vi bifogar det elektroniska kvittot. Med det kan du göra byten eller 
          returer. Om du går till butiken kan du visa upp det på din mobilskärm.
        </p>
        <p>
          Vid frågor, tveka inte att kontakta oss på 
          <a href="mailto:denthu.webbshop@outlook.com" style="color: #007BFF;">
            denthu.webbshop@outlook.com
          </a>!
        </p>
      </div>

      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
        <p>Hälsningar,<br />DenThu Webbshop</p>
        <p>
          Följ oss på sociala medier: 
          <a href="https://www.instagram.com/denthu" style="color: #007BFF;">Instagram</a>, 
          <a href="https://www.facebook.com/denthu" style="color: #007BFF;">Facebook</a>
        </p>
      </footer>
    </div>
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
        <li style="margin: 5px 0; font-size: 14px;">
          <span style="font-weight: bold;">${item.name}</span> - 
          ${i.quantity} st / ${(item.price * i.quantity).toFixed(2)} SEK
        </li>
      `;
    })
    .join("");

  const orderInfo = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="background-color: #fff4e6; padding: 20px; border-radius: 8px; border: 1px solid #ff6600;">
        <h4 style="color: #ff6600;">Ny order mottagen!</h4>
        <p><strong>Beställning nr:</strong> ${order.reference}</p>
           <p><strong>Kundens namn:</strong> 
          <p style="color: #007BFF;">
          ${order.guestFirstName} ${order.guestLastName}
          </p>
        </p>
        <p><strong>Kundens email:</strong> 
          <a href="mailto:${order.guestEmail}" style="color: #007BFF;">
            ${order.guestEmail}
          </a>
        </p>
        <p><strong>Leveransmetod:</strong> ${
          order.shippingMethod === "shipping"
            ? "Standardleverans till hemmet"
            : "Hämtas upp på plats"
        }</p>
        <p><strong>Leveransadress:</strong> ${shippingAddress}</p>
        
        <h3 style="margin-top: 20px; color: #555;">Beställningsdetaljer:</h3>
        <ul style="padding: 0 0 0 20px; margin: 0; list-style-type: disc;">
          ${itemsList}
        </ul>

        <p style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          Totalt belopp: ${(order.total_amount / 100).toFixed(2)} SEK
        </p>
      </div>
    </div>
  `;

  const templateParams = {
    from_name: "DenThu Webbshop",
    to_email: "denthu.webbshop@outlook.com", // DenThu's email
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
