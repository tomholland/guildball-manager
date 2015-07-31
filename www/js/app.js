var contentViewWidth = 0;
var currentTemplateId = null;
var selectedGuildId = null;
var selectedTeamId = null;

function htmlEncode(value){
	return $('<div/>').text(value).html().replace(/\"/g, '&quot;');
}

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c==='x' ? r : (r&0x7|0x8)).toString(16);
	});
	return uuid.toUpperCase();
}

function sortObjectArrayByObjectNameProperty(objA, objB) {
	return alphanumCase(objA.name, objB.name);
}

function renderView(templateId, contentId) {
	var templateData = {};
	switch(templateId) {
		case 'guilds':
			$('#title').html('Guilds');
			templateData.guilds = [];
			Object.keys(staticData.guilds).forEach(function(guildId) {
				templateData.guilds.push(staticData.guilds[guildId]);
			});
			$('#back').removeClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'guild_players':
			selectedGuildId = contentId;
			$('#title').html(htmlEncode(staticData.guilds[contentId].name));
			templateData.players = [];
			Object.keys(staticData.guilds[contentId].players).forEach(function(playerId) {
				templateData.players.push(staticData.guilds[contentId].players[playerId]);
			});
			$('#back').addClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'player_cards':
			$('#title').html(htmlEncode(staticData.guilds[selectedGuildId].players[contentId].name));
			templateData = staticData.guilds[selectedGuildId].players[contentId];
			$('#back').addClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'teams':
			$('#title').html('Teams');
			var teamsSortArray = [];
			Object.keys(teams).forEach(function(teamID) {
				teamsSortArray.push({
					id: teamID,
					name: teams[teamID].name
				});
			});
			if (settingIsEnabled('lexicographicalsort')) {
				teamsSortArray.sort(sortObjectArrayByObjectNameProperty);
			}
			templateData.teams = [];
			teamsSortArray.forEach(function(team) {
				templateData.teams.push({
					id: team.id,
					image: staticData.guilds[teams[team.id].guild].image,
					name: team.name,
					complete: teams[team.id].isComplete(),
					num_players: teams[team.id].players.length,
					player_limit: teams[team.id].playerLimit
				});
			});
			$('#back').removeClass('shown');
			$('#add').addClass('shown');
		break;
		case 'team':
			$('#title').html(((selectedTeamId === null) ? 'Create':'Edit')+' team');
			templateData.guilds = [];
			Object.keys(staticData.guilds).forEach(function(guildId) {
				templateData.guilds.push({
					id: guildId,
					name: staticData.guilds[guildId].name,
					selected: (selectedTeamId !== null && teams[selectedTeamId].guildId == guildId)
				});
			});
			$('#back').addClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'team_players':
			$('#title').html();
			
			$('#back').addClass('shown');
			$('#add').addClass('shown');
		break;
		case 'team_add_player':
			$('#title').html('Add player to team');
			/*
			Object.keys(staticData.guilds).forEach(function(guildId) {
				staticData.guilds[guildId].name
				staticData.guilds[guildId].image
				staticData.guilds[guildId].has_shareable_players?
				Object.keys(staticData.guilds[guildId].players).forEach(function(playerId) {
					staticData.guilds[guildId].players[playerId].name
					staticData.guilds[guildId].players[playerId].captain?
					staticData.guilds[guildId].players[playerId].mascot?
					staticData.guilds[guildId].players[playerId].also_available_to? // union
					staticData.guilds[guildId].players[playerId].cards
				});
			});
			*/
			$('#back').addClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'plots':
			$('#title').html('Plots');
			templateData.plots = [];
			Object.keys(staticData.plots).forEach(function(plotId) {
				templateData.plots.push(staticData.plots[plotId]);
			});
			$('#back').removeClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'plot_card':
			$('#title').html(htmlEncode(staticData.plots[contentId].name));
			templateData = staticData.plots[contentId];
			$('#back').addClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'guides':
			$('#title').html('Guides');
			templateData.guides = [];
			Object.keys(staticData.guides).forEach(function(guideId) {
				templateData.guides.push(staticData.guides[guideId]);
			});
			$('#back').removeClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'misc':
			$('#title').html('Misc.');
			$('#back').removeClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'settings':
			$('#title').html('Settings');
			templateData.settings = [];
			Object.keys(staticData.settings).forEach(function(settingId) {
				templateData.settings.push(staticData.settings[settingId]);
			});
			$('#back').addClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'faqs':
			$('#title').html('FAQs');
			templateData.faqs = [];
			Object.keys(staticData.faqs).forEach(function(faqId) {
				templateData.faqs.push(staticData.faqs[faqId]);
			});
			$('#back').addClass('shown');
			$('#add').removeClass('shown');
		break;
		case 'faq':
			$('#title').html(htmlEncode(staticData.faqs[contentId].title));
			templateData = staticData.faqs[contentId];
			$('#back').addClass('shown');
			$('#add').removeClass('shown');
		break;
	}
	$('.content').empty().html(Mustache.render(staticData.templates[templateId], templateData));
	$('.content-view .content-view-scroll-wrapper').css({width: contentViewWidth+'px', height: $('.content').height()+'px'});
	currentTemplateId = templateId;
	addEventsToRenderedView();
}

function addEventsToRenderedView() {
	switch(currentTemplateId) {
		case 'guilds':
			$('.content-items-list').find('a').tap(function() {
				renderView('guild_players', $(this).attr('data-guild-id'));
			});
		break;
		case 'guild_players':
			$('.content-items-list').find('a').tap(function() {
				renderView('player_cards', $(this).attr('data-player-id'));
			});
		break;
		case 'teams':
			
		break;
		case 'team':
			$('.content-view').find('form').on('submit', function(e) {
				e.preventDefault();
			});
			$('#saveteam').tap(function() {
				/*
				$('#teamguild').val()
				$('#teamname').val()
				$('#teamsize').val()
				
				var warbandFaction = $('#warbandfaction').val();
				var warbandName = $('#warbandname').val().trim();
				var warbandRice = $('#warbandrice').val().trim();
				if ($(this).attr('data-mode') === 'add' && Object.keys(staticData.factions).indexOf(warbandFaction) < 0) {
					navigator.notification.alert(
						'Please select a faction',
						function() {
							$('#warbandfaction').focus();
						}
					);
					return;
				}
				if (!warbandName.length) {
					navigator.notification.alert(
						'Please enter a Warband name',
						function() {
							$('#warbandname').focus();
						}
					);
					return;
				}
				if (warbandName.length > 28) {
					navigator.notification.alert(
						'Warband names are limited to 28 characters',
						function() {
							$('#warbandname').focus();
						}
					);
					return;
				}
				if (!warbandRice.match(/^[0-9]{1,2}$/)) {
					navigator.notification.alert(
						'Please enter a rice limit between 0 and 99',
						function() {
							$('#warbandrice').focus();
						}
					);
					return;
				}
				$('input,select').blur();
				warbandRice = parseInt(warbandRice, 10);
				if ($(this).attr('data-mode') === 'edit') {
					warbands[selectedWarbandID].name = warbandName;
					warbands[selectedWarbandID].playerLimit = warbandRice;
				} else {
					var newWarbandID = generateUUID();
					warbands[newWarbandID] = new Warband();
					warbands[newWarbandID].id = newWarbandID;
					warbands[newWarbandID].faction = warbandFaction;
					warbands[newWarbandID].name = warbandName;
					warbands[newWarbandID].playerLimit = warbandRice;
					selectedWarbandID = newWarbandID;
				}
				warbands[selectedWarbandID].save(function() {
					drawWarbands();
					drawWarbandCharacters();
					$('#add').attr('data-target-content-view-id', 'warbandcharacter').addClass('shown');
					swapContentView('warband', 'warbandcharacters', null);
				});
				*/
			});
		break;
		case 'team_players':
			
		break;
		case 'team_add_player':
			
		break;
		case 'plots':
			$('.content-items-list').find('a').tap(function() {
				renderView('plot_card', $(this).attr('data-plot-id'));
			});
		break;
		case 'guides':
			$('.content-items-list').find('a').tap(function() {
				cordova.plugins.disusered.open(cordova.file.applicationDirectory+'www/'+$(this).attr('data-url'));
			});
		break;
		case 'misc':
			$('.content-items-list').find('a').tap(function() {
				renderView($(this).attr('data-template-id'), null);
			});
		break;
		case 'settings':
			loadSettings(function() {
				$('.content-items-list').find('.toggle').each(function() {
					if (settingIsEnabled($(this).attr('data-setting-id'), $(this).attr('data-default'))) {
						$(this).addClass('active');
					}
				});
			});
			$('.content-items-list').find('.toggle').on('toggle', function(toggleEvent) {
				settings[$(this).attr('data-setting-id')].save(toggleEvent.detail.isActive, null);
			});
		break;
		case 'faqs':
			$('.content-items-list').find('a').tap(function() {
				renderView('faq', $(this).attr('data-faq-id'));
			});
		break;
		case 'faq':
			$('.content-view').find('a.external').tap(function() {
				window.open(encodeURI($(this).attr('data-url')), '_system');
			});
			$('.content-view').find('a.email').tap(function() {
				cordova.require('emailcomposer.EmailComposer').show({
					to: $(this).attr('data-email'),
					subject: $(this).attr('data-subject')
				});
			});
			$('.content-view').find('a.twitter').tap(function() {
				var username = $(this).attr('data-username');
				appAvailability.check(
					'tweetbot://',
					function() { // success
						window.open(encodeURI('tweetbot:///user_profile/'+username), '_system');
					},
					function() { // fail
						appAvailability.check(
							'twitterrific://',
							function() { // success
								window.open(encodeURI('twitterrific:///profile?screen_name='+username), '_system');
							},
							function() { // fail
								appAvailability.check(
									'twitter://',
									function() { // success
										window.open(encodeURI('twitter://user?screen_name='+username), '_system');
									},
									function() { // fail
										window.open(encodeURI('https://twitter.com/'+username), '_system');
									}
								);
							}
						);
					}
				);
			});
		break;
	}
	
	$('.content').find('a').on('click', function() {
		$(this).trigger('tap');
	});
}

document.addEventListener('deviceready', function() {
	/*
	Keyboard.automaticScrollToTopOnHiding = true;
	Keyboard.shrinkView(false);
	Keyboard.disableScrollingInShrinkView(true);
	*/
	
	Object.keys(staticData.templates).forEach(function(templateId) {
		Mustache.parse(staticData.templates[templateId]); // pre-parse for speed
	});
	
	contentViewWidth = $('.content').width();
	
	//$('#back').tap(function() {
	$('#back').on('click', function() {
		switch(currentTemplateId) {
			case 'guild_players':
				renderView('guilds', null);
			break;
			case 'player_cards':
				renderView('guild_players', selectedGuildId);
			break;
			case 'team':
			case 'team_players':
				renderView('teams', null);
			break;
			case 'team_add_player':
				
			break;
			case 'plot_card':
				renderView('plots', null);
			break;
			case 'settings':
			case 'faqs':
				renderView('misc', null);
			break;
			case 'faq':
				renderView('faqs', null);
			break;
		}
	});
	
	//$('#add').tap(function() {
	$('#add').on('click', function() {
		switch(currentTemplateId) {
			case 'teams':
				renderView('team', null);
			break;
			case 'team_players':
				
			break;
		}
	});
	
	//$('nav').find('a').tap(function() {
	$('nav').find('a').on('click', function() {
		$('nav').find('a').removeClass('active');
		renderView($(this).attr('data-template-id'), null);
		$(this).addClass('active');
	});
	
	renderView('guilds', null);
	$('nav').find('[data-template-id=guilds]').addClass('active');
	
}, false);

$(document).trigger('deviceready');