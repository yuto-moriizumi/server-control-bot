# Server control bot

This is the discord bot allows everyone to manage systemd services with ease.
Mainly aimed for game servers.

## Usage

### Setup & run

1. Setup node environment
1. `npm ci` to install dependencies
1. Create `.env` file and input discord bot token & client id
1. `npm run start` to run the bot

### Setup the bot service (optional)

Systemd service example on the AWS EC2 with nvm environment

```
[Unit]
Description=Server control bot
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/ec2-user/server-control-bot
ExecStart=/home/ec2-user/.nvm/nvm-exec npm run start
Environment="NODE_VERSION=v16.20.2"
Restart=always
User=ec2-user

[Install]
WantedBy=default.target
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
