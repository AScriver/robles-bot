const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a dice with optional sides and count.')
		.addIntegerOption(option =>
			option.setName('sides')
				.setDescription('Number of sides per die')
				.setRequired(false))
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('Number of dice to roll')
				.setRequired(false)),
	async execute(interaction) {
		const sides = interaction.options.getInteger('sides') ?? 6;
		const count = interaction.options.getInteger('count') ?? 1;
		if (sides <= 0 || count <= 0) {
			return interaction.reply({ content: 'Sides and count must be positive integers.', ephemeral: true });
		}
		const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
		await interaction.reply(`You rolled: ${rolls.join(', ')}`);
	},
};
