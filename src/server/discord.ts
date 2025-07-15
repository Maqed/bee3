import { env } from "@/env";

export interface AdDetails {
  username: string;
  email: string;
  message: string;
  type: string;
  dp?: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  images: string[];
  category: string;
  city: string;
  governorate: string;
}

export const sendDiscordMessage = async (ad: AdDetails): Promise<string | null> => {
  try {
    const res = await fetch(`${env.DISCORD_WEBHOOK_URL}?wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Ad Request",
        content: `New Ad Request from ${ad.username} (${ad.email})`,
        embeds: [
          {
            title: ad.title,
            description: ad.description,
            fields: [
              { name: "Email", value: ad.email, inline: true },
              { name: "Message Type", value: ad.type, inline: true },
              { name: "Price", value: ad.price.toString(), inline: true },
              { name: "Negotiable", value: ad.negotiable ? "Yes" : "No", inline: true },
              { name: "Category", value: ad.category, inline: true },
              { name: "City", value: ad.city, inline: true },
              { name: "Governorate", value: ad.governorate, inline: true },
              { name: "Images", value: ad.images.join("\n") || "None", inline: false },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.id || null;
  } catch (err: any) {
    console.log(err.message);
    return null;
  }
};

export const deleteDiscordMessage = async (messageId: string) => {
  try {
    // Discord webhook URL: https://discord.com/api/webhooks/{webhook.id}/{webhook.token}
    // Message delete: /messages/{message.id}
    const baseUrl = env.DISCORD_WEBHOOK_URL.replace(/\/?$/, "");
    const url = `${baseUrl}/messages/${messageId}`;
    const res = await fetch(url, { method: "DELETE" });
    return res.status === 204;
  } catch (err: any) {
    console.log(err.message);
    return false;
  }
};