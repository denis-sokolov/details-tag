/*!Denis Sokolov, http://akral.bitbucket.org/details-tag/, denis@sokolov.cc. GPL, MIT */
;(function($){
	// Chrome 10 will fail this detection, but Chrome 10 is no longer existing
	var support = 'open' in document.createElement('details');

	// API
	$.fn.details = function(command) {
		if (command == 'open')
		{
			if (support)
				this.prop('open', true);
			else
				this.trigger('open.details');
		}

		if (command == 'close')
		{
			if (support)
				this.prop('open', false);
			else
				this.trigger('close.details');
		}

		if (!command)
			return support ? this.open : this.hasClass('open');
	}

	if (support)
	{
		// Add our triggers on native implementation
		$('body').on('click', 'summary', function(){
			var details = $(this).parent();
			if (details.prop('open'))
				details.trigger('close');
			else
				details.trigger('open');
		});
		return;
	}

	$('head').append('<style>'
		// Style
		+'summary{cursor:pointer}'
		+'details.closed>summary::before{content:"►"}'
		+'details.open>summary::before{content:"▼"}'

		// Behaviour
		// IE7-8 does not support :not selector.
		// It would allow us not to use .closed
		+'summary{display:block}'
		+'details.closed>*{display:none}'
		+'details.closed>summary{display:block}'
		+'</style>');

	$('details')
		// Main toggle action
		.on('open.details', function(){
			$(this).addClass('open').removeClass('closed').trigger('change.details');
		})
		.on('close.details', function(){
			$(this).addClass('closed').removeClass('open').trigger('change.details');
		})
		.on('toggle.details', function(){
			var me = $(this);
			if (me.hasClass('open'))
				me.trigger('close');
			else
				me.trigger('open');
		})

		// Add missing summary tags
		.each(function(){
			var me = $(this);
			if (!me.children('summary').length)
				me.prepend('<summary>Details</summary>');
		})

		// Make summary toggle details
		.children('summary')
			// Clicks
			.click(function(){
				$(this).parent().trigger('toggle');
			})

			// Keyboard
			.filter(':not(tabindex)').attr('tabindex', 0).end()
			.keyup(function(e){
				// 32 - space
				// 13 - Enter. Opera triggers .click()
				if (e.keyCode == 32 || (e.keyCode == 13 && !$.browser.opera))
					$(this).parent().trigger('toggle');
			})
		.end()

		// Wrap plain text nodes in spans for CSS visibility
		.contents(':not(summary)').filter(function(){
				return (this.nodeType === 3) && (/[^\t\n\r ]/.test(this.data));
			})
			.wrap('<span>')
		.end().end()

		// Initial positions
		.filter(':not([open])')
			.addClass('closed')
			.prop('open', false)
		.end()
		.filter('[open]')
			.addClass('open')
			.prop('open', true)
		.end();
})(jQuery);

