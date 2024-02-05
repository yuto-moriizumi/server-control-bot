import { Client, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config();

const COMMAND = {
  鯖スタート: {
    desc: "鯖を立ち上げる",
    cmd: "sudo systemctl start palworld",
    msg: "鯖を立ち上げました",
  },
  鯖再起: {
    desc: "鯖を再起動",
    cmd: "sudo systemctl restart palworld",
    msg: "鯖を再起動しました",
  },
  鯖停止: {
    desc: "鯖を止める",
    cmd: "sudo systemctl stop palworld",
    msg: "鯖を停止しました",
  },
} as const;

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN ?? "");

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID ?? ""), {
      body: Object.entries(COMMAND).map(([k, v]) => ({
        name: k,
        description: v.desc,
      })),
    });
    console.log("Successfully reloaded application (/) commands.");

    const client = new Client({ intents: [] });

    client.on("ready", () => {
      console.log(`Logged in as ${client?.user?.tag}!`);
    });

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      switch (interaction.commandName as keyof typeof COMMAND) {
        case "鯖スタート":
        case "鯖再起":
        case "鯖停止":
          const key = interaction.commandName as keyof typeof COMMAND;
          await interaction.deferReply();
          execSync(COMMAND[key].cmd);
          await interaction.followUp(COMMAND[key].msg);
          break;
        default:
          break;
      }
    });

    await client.login(process.env.TOKEN ?? "");
  } catch (error) {
    console.error(error);
  }
})();
