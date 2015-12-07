Package.describe({
	name: "ultimatejs:event-selector-blaze-legacy",
	summary: "Blaze style event selectors",
	version: '0.0.1',
	documentation: 'README.md',
	git: 'https://github.com/ultimatejs/event-selector-blaze-legacy'
});

Package.onUse(function (api) {
	api.versionsFrom('METEOR@1.2.1');
	api.use('underscore');
	api.use('ecmascript@0.1.5');
	
	
	api.addFiles([
		'event-selector-mixin.js',
		'underscore-mixin.js',
	]);
	api.export('EventSelectorBlazeLegacy');
});

