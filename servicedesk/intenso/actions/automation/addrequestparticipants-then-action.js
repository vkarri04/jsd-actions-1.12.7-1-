define("servicedesk/intenso/actions/automation/addrequestparticipants-then-action-form", [
    "servicedesk/intenso/actions/automation/addrequestparticipants-then-action-model",
    "servicedesk/intenso/actions/automation/addrequestparticipants-then-action-view"
], function (
    AddRequestParticipantsModel,
    AddRequestParticipantsView
) {

    let Ajax = {};
    try {
        Ajax = require("servicedesk/internal/agent/settings/automation/util/ajax/ajax");
    } catch (exception1) {
        try {
            Ajax = require("servicedesk/internal-api/core/util/ajax/ajax");
        } catch (exception2) {
            console.error("Ajax package not found.");
        }
    }

    let $ = {};
    try {
        $ = require("jquery");
    } catch (exception1) {
        try {
            $ = require("servicedesk/jQuery");
        } catch (exception2) {
            console.error("jQuery package not found.");
        }
    }

    let _ = {};
    try {
        _ = require("automation/underscore");
    } catch (exception1) {
        try {
            _ = require("servicedesk/underscore");
        } catch (exception2) {
            console.error("Underscore package not found.");
        }
    }

    function onDeffered (requestParticipantDisplayNames, errors, template, requestParticipantKeys, $el) {
        $el.html(template());

        this.addRequestParticipantsView = new AddRequestParticipantsView({
            model: new AddRequestParticipantsModel({
                requestParticipantKeys: requestParticipantKeys
            }),
            el: $el.find(".automation-servicedesk-intenso-add-request-participants-then-action-container")
        }).render();
        if (errors) {
            if (errors.fieldErrors) {
                _applyFieldErrors(errors.fieldErrors);
            }

            if (errors.globalErrors) {
                _applyGlobalErrors(errors.globalErrors);
            }
        }
        for(let i = 0; i<requestParticipantKeys.length ; i++) {
            $el.find('#requestParticipantKeys').append($("<option selected></option>").val(requestParticipantKeys[i]).text(requestParticipantDisplayNames[i]))
        }
        $el.find('#requestParticipantKeys').select2intenso({
            allowClear: true,
            placeholder: "Select users",
            ajax: {
                url: AJS.params.baseURL + "/rest/api/2/user/picker",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        query: params.term
                    };
                },
                processResults: function (data, params) {
                    const objects = [];
                    jQuery.each( data.users, function( key, value ) {
                        const  item = {};
                        item ["id"] = value.key;
                        item ["text"] = value.displayName;
                        objects.push(item);
                    });
                    return {
                        results: objects
                    };
                },
                cache: true
            },
            minimumInputLength: 1,
            templateResult: function(state) {
                if (state.text) { return state.text; } return state.name;
            },
            templateSelection: function(state) {
                if (state.text) { return state.text; } return state.name;
            }
        }).val(requestParticipantKeys).trigger('change');

    }

    const addRequestParticipantsView = function(controller) {
        const template = JSDActions.Templates.Automation.Modules.RuleThen.AddRequestParticipants.addRequestParticipantsThenActionContainer;
        const $el = $(controller.el);

        function onError(errors) {
            $el.find('.error').remove();
            _applyFieldErrors(errors.fieldErrors);
            _applyGlobalErrors(errors.globalErrors);
        }

        function onDestroy() {
            controller.off('destroy');
            controller.off('error');
        }

        function _applyFieldErrors(errors) {
            _.each(errors, controller.renderFieldError)
        }

        function _applyGlobalErrors(errors) {
            for (let i = 0; i < errors.length; i++) {
                const thisError = errors[i];
                controller.renderGlobalError(thisError)
            }
        }

        controller.on('destroy', onDestroy.bind(this));
        controller.on('error', onError.bind(this));


        function onRender (config, errors) {

            const requestParticipantKeys = config && config.requestParticipantKeys ? config.requestParticipantKeys.split(",") : [];
            const url = AJS.contextPath() + "/rest/jsdaction/1.0/jsdaction/getUsersDisplayNames?userKeys=" + requestParticipantKeys;
            const deferred = Ajax.get(url);

            deferred.done(_.bind((data) => onDeffered(data, errors, template, requestParticipantKeys, $el), this));

            return deferred;
        }
        return {
            render: onRender,

            serialize: function () {
                return {
                    requestParticipantKeys: $el.find('#requestParticipantKeys').val().toString()
                }
            },

            validate: function (deferred) {
                $el.find('.error').remove();
                let hasError = false;
                const userKeyField = $el.find('#requestParticipantKeys');
                const fieldErrors = {};

                if (!userKeyField.val() || userKeyField.val().length == 0) {
                    fieldErrors[userKeyField.attr('name')] = "Field Request Participants is required.";
                    hasError = true;
                }

                if (hasError) {
                    _applyFieldErrors(fieldErrors);
                    deferred.reject();
                }
                else {
                    deferred.resolve();
                }
            },

            dispose: function() {
                if (this.addRequestParticipantsView) {
                    this.addRequestParticipantsView.dispose && this.addRequestParticipantsView.dispose();
                }
            }
        }

    };

    return function(controller) {
        return addRequestParticipantsView(controller);
    };

});