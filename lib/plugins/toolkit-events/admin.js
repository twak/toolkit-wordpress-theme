(function($){
    acf.add_filter('date_picker_args', function( args, $field ){
        if ($field.name == 'tk_events_start_date') {
            args.onSelect = function(date, input){
                var $end_input = $('input[name="tk_events_end_date"]'),
                    end_date = $end_input.datepicker('getDate'),
                    start_date = input.datepicker('getDate');
                if (start_date) {
                    if ( ! end_date || (end_date < start_date) ) {
                        $end_input.datepicker('setDate', start_date);
                    }
                    $end_input.datepicker('option','minDate',start_date);
                }
            };
        }
        if ($field.name == 'tk_events_end_date') {
            args.onSelect = function(date, input){
                var $start_input = $('input[name="tk_events_start_date"]'),
                    start_date = $start_input.datepicker('getDate'),
                    end_date = input.datepicker('getDate');
                if (end_date) {
                    if ( ! start_date || (end_date < start_date) ) {
                        $start_input.datepicker('setDate', end_date);
                        input.datepicker('option','minDate',end_date);
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