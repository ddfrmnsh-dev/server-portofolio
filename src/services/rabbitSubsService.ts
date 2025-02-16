import { safeSubscribe } from "../utils/rabbitmq";

export const startConsumeRabbit = async () => {
    await safeSubscribe("my_queue", async (message) => {
        console.log(`📬 Message received from RabbitMQ: ${message}`);
    //   const { userId, documentName, timestamp } = JSON.parse(message);
  
    //   console.log(`📄 Generating PDF for user: ${userId}`);
    //   console.log(`🛠️ Document: ${documentName}`);
    //   console.log(`🕒 Requested at: ${timestamp}`);
  
      // 🖨️ Simulasi proses pembuatan PDF
    //   await new Promise((resolve) => setTimeout(resolve, 3000));
    //   console.log(`✅ PDF "${documentName}" has been successfully generated for user ${userId}`);
    });
  };