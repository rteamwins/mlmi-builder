/*
* MLMI Builder
*/
let mlmi_builder = {
	builder: undefined,
	ready: false,
};

function builder_make_uid(length) {
   var result = '';
   var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

(function($) {
	'use strict';

	$.fn.MLMI_Shortcode = function() {
		let self = this;
		if (self.data('shortcode')) {
			return self
		}

		self.initialize = function() {
			let layout = self.closest('.layout'),
			layout_type = layout.data('layout');

			/* Layout type */
			if (layout_type == 'text_row') {
				layout_type = 'row';
			}
			self.find('.shortcode-type-cell').text(layout_type);

			/* Update UID */
			layout.find('.acf-field[data-name="row_id"] input[type="text"]').on('change keyup', self.update);
			self.update();
		}

		self.update = function() {
			let layout = self.closest('.layout'),
			layout_uid_field = layout.find('.acf-field[data-name="row_uid"] input[type="text"]'),
			layout_id_field = layout.find('.acf-field[data-name="row_id"] input[type="text"]');

			/* Layout UID */
			if (!layout_uid_field.val()) {
				layout_uid_field.val(builder_make_uid(6));
			}
			let layout_uid = layout_uid_field.val();
			if (layout_id_field.val()) {
				layout_uid = layout_id_field.val();
			}
			self.find('.shortcode-uid-cell').text(layout_uid);
		}

		self.clicked = function() {
			let textarea = $('<textarea>');
			self.append(textarea);
			textarea.val(self.find('.badge-shortcode').text()).focus().select();
    	document.execCommand("Copy");
			textarea.remove()
			self.find('.shortcode-copied').finish().show().delay(750).fadeOut(750);
		}

		return function() {
			self.find('.badge-shortcode').on('click', self.clicked);
			self.initialize();
			self.data('shortcode', self);
			return self;
		}();
	}

	/*
	*	MLMI Builder
	*/
	$.fn.MLMI_Builder = function() {
		let self = this;

		self.init = function() {
			/* Add behavior for standard row */
			let text_rows = self.find(".layout[data-layout=text_row]:not(.acf-clone)");
			text_rows.each(function(index, element) {
				self.register(element);
				self.columns(element)
			});

			/* Add behavior for all rows */
			let all_rows = self.find(".layout:not(.acf-clone)");
			all_rows.each(function(index, element) {
				self.shortcodes(element);
			});

			/* Always reset to first tab */
			$('.acf-tab-group').each(function() {
				$(this).find('li a').first().click();
			});

			/* Make visible when fully initialized */
			$('#acf-mlmi_builder_main .acf-fields').css({
				visibility: 'visible'
			});
			$('#acf-mlmi_builder_main').removeClass('loading').addClass('loaded');
		};

		self.register = function(row) {
			$(row).find("div.acf-field.select-cols-number select").on("click", function() {
				$(row).data('is_manual_action', true);
			});
			$(row).find("div.acf-field.select-cols-number select").on("change", function() {
				self.columns(row);
			});
		};

		self.columns = function(row) {
			let columns_choice = $(row).find("div.acf-field.select-cols-number select").val();
			let columns_number = parseInt($(row).find("div.acf-field.select-cols-number select").val(), 10);
			let columns_custom = (columns_choice == columns_number);

			if (columns_number == 3) {
				$(row).find(".mlmi-builder-column[data-name=col_1]").css("width", "33.333%").removeClass('d-none');
				$(row).find(".mlmi-builder-column[data-name=col_2]").css("width", "33.333%").removeClass('d-none');
				$(row).find(".mlmi-builder-column[data-name=col_3]").removeClass('d-none');
				if (columns_custom) {
					$(row).find(".mlmi-builder-column-option[data-name=col_1_group]").css("width", "33.333%").show();
					$(row).find(".mlmi-builder-column-option[data-name=col_2_group]").css("width", "33.333%").show();
					$(row).find(".mlmi-builder-column-option[data-name=col_3_group]").css("width", "33.333%").show();
					if ($(row).data('is_manual_action')) {
						$(row).find('.acf-field[data-name=column_width] select').val(4);
					}
				}
			} else if (columns_number == 2) {
				$(row).find(".mlmi-builder-column[data-name=col_1]").css("width", "50%").removeClass('d-none');
				$(row).find(".mlmi-builder-column[data-name=col_2]").css("width", "50%").removeClass('d-none');
				$(row).find(".mlmi-builder-column[data-name=col_3]").removeClass('d-none');
				if (columns_custom) {
					$(row).find(".mlmi-builder-column-option[data-name=col_1_group]").css("width", "50%").show();
					$(row).find(".mlmi-builder-column-option[data-name=col_2_group]").css("width", "50%").show();
					if ($(row).data('is_manual_action')) {
						$(row).find('.acf-field[data-name=column_width] select').val(6);
					}
				}
			} else if (columns_number == 1) {
				$(row).find(".mlmi-builder-column[data-name=col_1]").css("width", "100%").removeClass('d-none');
				$(row).find(".mlmi-builder-column[data-name=col_2]").removeClass('d-none');
				$(row).find(".mlmi-builder-column[data-name=col_3]").removeClass('d-none');
				if (columns_custom) {
					$(row).find(".mlmi-builder-column-option[data-name=col_1_group]").css("width", "100%").show();
					if ($(row).data('is_manual_action')) {
						$(row).find('.acf-field[data-name=column_width] select').val(12);
					}
				}
			}
			$(row).find(".mlmi-builder-column-option[data-name=col_1]").addClass('-c0');
			$(row).find(".mlmi-builder-column-option[data-name=col_2]").removeClass('-c0');
			$(row).find(".mlmi-builder-column-option[data-name=col_3]").removeClass('-c0');
			if (columns_custom) {
				$(row).find(".mlmi-builder-column-option[data-name=col_1_group]").addClass('-c0').css('min-height', '');
				$(row).find(".mlmi-builder-column-option[data-name=col_2_group]").removeClass('-c0').css('min-height', '');
				$(row).find(".mlmi-builder-column-option[data-name=col_3_group]").removeClass('-c0').css('min-height', '');
			} else {
				$(row).find(".mlmi-builder-column-option[data-name=col_1_group]").hide();
				$(row).find(".mlmi-builder-column-option[data-name=col_2_group]").hide();
				$(row).find(".mlmi-builder-column-option[data-name=col_3_group]").hide();
			}
		};

		self.shortcodes = function(row) {
			$(row).find('.shortcode-container').MLMI_Shortcode();
		}

		return function() {
			acf.addAction('ready', function() {
				self.init();
			});
			acf.addAction('append', self.register);
			acf.addAction('append', self.columns);
			acf.addAction('append', self.shortcodes);
			return self;
		}();
	}

	if (typeof acf !== 'undefined' && typeof acf.addAction !== 'undefined') {
		mlmi_builder.builder = $(".mlmi-builder-section").MLMI_Builder();
		$('#acf-mlmi_builder_main').addClass('loading');
	}
})(jQuery);
