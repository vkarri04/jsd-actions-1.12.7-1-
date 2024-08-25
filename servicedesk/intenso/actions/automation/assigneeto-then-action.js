define("servicedesk/intenso/actions/automation/assigneeto-then-action-form", [
    "servicedesk/intenso/actions/automation/assigneeto-then-action-model",
    "servicedesk/intenso/actions/automation/assigneeto-then-action-view"
], function (
    AssigneeToModel,
    AssigneeToView
) {

    let  Ajax = {};
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

    const assigneeToView = function(controller) {
        const template = JSDActions.Templates.Automation.Modules.RuleThen.AssigneeTo.assigneeToThenActionContainer;
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

        function onProcessResults(data, params) {
            const objects = [];
            jQuery.each( data.users, function( key, value ) {
                const item = {};
                item ["id"] = value.key;
                item ["text"] = value.displayName;
                objects.push(item);
            });
            return {
                results: objects
            };
        }

        function onRender (config, errors) {
            const userKey = config && config.userKey ? config.userKey : "";

            $el.html(template());

            this.assigneeToView = new AssigneeToView({
                model: new AssigneeToModel({
                    userKey: userKey
                }),
                el: $el.find(".automation-servicedesk-intenso-add-assignee-then-action-container")
            }).render();

            if (errors) {
                if (errors.fieldErrors) {
                    _applyFieldErrors(errors.fieldErrors);
                }

                if (errors.globalErrors) {
                    _applyGlobalErrors(errors.globalErrors);
                }
            }

            $el.find('#userKey').select2intenso({
                allowClear: true,
                placeholder: "Select user",
                ajax: {
                    url: AJS.params.baseURL + "/rest/api/2/user/picker",
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            query: params.term
                        };
                    },
                    processResults: onProcessResults,
                    cache: true
                },
                minimumInputLength: 2,
                templateResult: function(state) {
                    if (state.text) { return state.text; } return state.name;
                },
                templateSelection: function(state) {
                    if (state.text) { return state.text; } return state.name;
                }
            });
            return this;

            /*var deferred = $.Deferred();
            var url = ContextPath + "/rest/jsdaction/1.0/jsdextender/getAllUsers";
            deferred = Ajax.get(url);

            deferred.done(_.bind(function (data) {
                var $template = $(template({
                    userKey: userKey,
                    allUsers: data
                }));

                $el.html(template());

                this.assigneeToView = new AssigneeToView({
                    model: new AssigneeToModel({
                        userKey: userKey,
                        allUsers : data
                    }),
                    el: $el.find(".automation-servicedesk-intenso-add-assignee-then-action-container")
                }).render();

                if (errors) {
                    if (errors.fieldErrors) {
                        _applyFieldErrors(errors.fieldErrors);
                    }

                    if (errors.globalErrors) {
                        _applyGlobalErrors(errors.globalErrors);
                    }
                }
                $el.find('#userKeySelect').select2();
            }, this));
            return deferred;*/
        }
        return {
            render: onRender,

            serialize: function () {
                return {
                    //userKey: $el.find('#userKeySelect').val()
                userKey: $el.find('#userKey').val()
                }
            },

            validate: function (deferred) {
                $el.find('.error').remove();
                let hasError = false;
                //const userKeyField = $el.find('#userKeySelect');
                const userKeyField = $el.find('#userKey');
                const fieldErrors = {};

                if (!userKeyField.val() || userKeyField.val() == "") {
                    fieldErrors[userKeyField.attr('name')] = "User is requireds";
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
                if (this.assigneeToView) {
                    this.assigneeToView.dispose && this.assigneeToView.dispose();
                }
            }
        }
    };

    return function(controller) {
        return assigneeToView(controller);
    };
});