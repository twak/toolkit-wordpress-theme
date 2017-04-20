(function($){
    /**
     * add arguments to the datepickers to automate population
     * of end date, and ensure end date is after start date
     */
    acf.add_filter('date_picker_args', function( args, $field ){
        // start date datepicker
        if ($field.data('name') == 'tk_events_start_date') {
            args.onSelect = function(date, input){
                // get datepickers and dates
                var $end_dp = $('[data-name="tk_events_end_date"] input.hasDatepicker'),
                    $start_dp = $('[data-name="tk_events_start_date"] input.hasDatepicker'),
                    end_date = $end_dp.datepicker('getDate'),
                    start_date = $start_dp.datepicker('getDate');
                if (start_date) {
                    if ( ! end_date || (end_date < start_date) ) {
                        $end_dp.datepicker('setDate', start_date);
                    }
                    $end_dp.datepicker('option','minDate',start_date);
                } else {
                    $end_dp.datepicker('setDate', '');
                }
            };
        }
        // end date datepicker
        if ($field.data('name') == 'tk_events_end_date') {
            args.onSelect = function(date, input){
                var $end_dp = $('[data-name="tk_events_end_date"] input.hasDatepicker'),
                    $start_dp = $('[data-name="tk_events_start_date"] input.hasDatepicker'),
                    end_date = $end_dp.datepicker('getDate'),
                    start_date = $start_dp.datepicker('getDate');
                if (end_date) {
                    if ( ! start_date || (end_date < start_date) ) {
                        $start_dp.datepicker('setDate', end_date);
                        $end_dp.datepicker('option', 'minDate', end_date);
                    }
                } else {
                    if ( start_date ) {
                        $end_dp.datepicker('setDate', start_date);
                        $end_dp.datepicker('option', 'minDate', start_date);
                    }
                }

            };
        }
        // return
        return args;
    });
    acf.add_action('date_picker_init', function( $input, args, $field ){
        
        // $input (jQuery) text input element
        // args (object) args given to the datepicker function
        // $field (jQuery) field element 
        
    });
})(jQuery);