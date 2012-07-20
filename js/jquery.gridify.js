(function($) {

  // Created by Matt Layton
  // mattlayton.co.uk

  $.fn.gridify = function(options) {

    var opts = $.extend({}, $.fn.gridify.defaults, options);

    return this.each(function() {
      var $container = $(this);

      // Handle window resizing.
      $(window).smartresize(mkgrid);

      // Apply styling.
      // Ensure images are capped at max-width.
      $container.find('img').css({
        'height': 'auto',
        'max-width': '100%',
        '-moz-box-sizing': 'border-box',
        'webkit-box-sizing': 'border-box',
        'box-sizing': 'border-box'
      });

      // Add clearfix as last list item element.
      var clearfix = ({
        'content': '.',
        'display': 'block',
        'clear': 'both',
        'visibility': 'hidden',
        'line-height': 0,
        'height': 0
      });

      // Apply clearfix for container.
      $container.children('.gridify-clear').remove();
      $container.last().append('<div class="gridify-clear" />');
      $('.gridify-clear').css(clearfix);

      // Define item collection.
      var $items = $container.children(opts.children).not('.gridify-clear');

      // Generate grid.
      mkgrid();

      /**
       * Generates and outputs the gridded image display.
       */
      function mkgrid() {
        var tallest = 0;  // Current tallest row item.
        var row = 0;      // Current row id.
        var row_item = 1; // Current item index on row.

        var row_count = Math.ceil( $items.length / opts.items ); // Total rows.

        var width = $container.width();  // Collection container width.

        jQuery.each($items, function(key, val) {
          $this = $(this);

          // Remove any inline styles.
          $this.removeAttr('style');

          // Apply styles.
          $this.css('float', 'left');

          // Apply margins.
          var left    = parseInt( $(this).css('margin-left') );
          var right   = parseInt( $(this).css('margin-right') );
          var bottom  = parseInt( $(this).css('margin-bottom') );

          $(this).css('margin-right', right);
          $(this).css('margin-bottom', bottom);

          // Calculate items padding and margins on x-axis.
          var padding_width = parseInt( $(this).css('padding-left') ) +
          parseInt( $(this).css('padding-right') ) +
          left + right;

          padding_width -= right / opts.items;
          padding_width -= left / opts.items;

          // Calculate total horizontal space.
          var additional_hspace = padding_width * opts.items;

          // Calculate total pixels per item .
          var pixels = Math.floor( ( width - additional_hspace ) / opts.items );

          // Convert pixel measurments to percentage value (to 6 decimal places) and apply to item.
          var percent = (( pixels / width ) * 100).toFixed(6) + '%';
          $this.css('width', percent);

          // Reset height to natural value.
          $(this).height('auto');

          // Check against tallest item.
          if ($(this).height() > tallest)
            tallest = $(this).height();

          // Next row.
          if (row_item >= opts.items ||
              key == $items.length - 1) {

            // Set height of all items on the row to be tallest.
            for (var i = 0; i < opts.items; i++) {
              // get current item on row
              var item = $items[(row * opts.items) + i];

              // Remove margin-top form first row.
              if (row === 0)
                $(item).css('margin-top', 0);

              // Remove margin-bottom from last row.
              if (row == row_count - 1)
                $(item).css('margin-bottom', 0);

              // Remove margin-left from first item on row.
              if (i === 0)
                $(item).css('margin-left', 0);

              // Remove margin-right from last item on row.
              if (i === (opts.items - 1))
                $(item).css('margin-right', 0);

              // Set item height to tallest row item height.
              if (item)
                $(item).height(tallest);
            }

            // Increment row counter.
            row++;

            // Reset item count and tallest item value.
            tallest = 0;
            row_item = 0;
          }

          // Increment item counter on row.
          row_item++;
        });
      }
    });

  }

  // Set Gridify plugin defaults.
  $.fn.gridify.defaults = {
    chlidren: 'li',
    items: 3  // How many items per row.
  }

})(jQuery);
