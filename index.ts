import { Client, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { execSync } from "child_process";
import { validateEnv } from "@volgakurvar/vaidate-env";
import { str } from "envalid";

dotenv.config();
const loadedEnv = validateEnv({
  TOKEN: str(),
  CLIENT_ID: str(),
  SERVICE_NAME: str({ default: "palworld" }),
  STEAMCMD_PATH: str({ default: "../steamcmd.sh" }),
  INSTALL_DIR: str({ default: "Satisfactory" }),
  APP_ID: str({ default: "2394010" }),
});
type Env = Exclude<typeof loadedEnv, Error>;

function getCommands(env: Env) {
  return {
    鯖スタート: {
      desc: "鯖を立ち上げる",
      cmd: `sudo systemctl start ${env.SERVICE_NAME}`,
      msg: "鯖を立ち上げました",
    },
    鯖再起: {
      desc: "鯖を再起動",
      cmd: `sudo systemctl restart ${env.SERVICE_NAME}`,
      msg: "鯖を再起動しました",
    },
    鯖停止: {
      desc: "鯖を止める",
      cmd: `sudo systemctl stop ${env.SERVICE_NAME}`,
      msg: "鯖を停止しました",
    },
    鯖アップデート: {
      desc: "鯖をアップデートする",
      cmd: `${env.STEAMCMD_PATH} +force_install_dir ${env.INSTALL_DIR} +login anonymous +app_update ${env.APP_ID} validate +quit`,
      msg: "鯖をアップデートしました",
    },
  } as const;
}

function main(env: Env) {
  const COMMAND = getCommands(env);
  const rest = new REST({ version: "10" }).setToken(env.TOKEN);

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
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
          case "鯖アップデート":
            const key = interaction.commandName as keyof typeof COMMAND;
            await interaction.deferReply();
            const result = execSync(COMMAND[key].cmd).toString();
            let message = COMMAND[key].msg;
            if (result !== "") message += "\n```" + result + "```";
            await interaction.followUp(message);
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
}

if (!(loadedEnv instanceof Error)) {
  main(loadedEnv);
} else {
  console.error("Required environmental value is not configured!");
  process.exit(1);
}
