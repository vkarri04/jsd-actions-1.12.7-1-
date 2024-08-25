define("servicedesk/intenso/actions/automation/setpriority-then-action-form", [
    "servicedesk/intenso/actions/automation/setpriority-then-action-model",
    "servicedesk/intenso/actions/automation/setpriority-then-action-view"
], function (
    SetPriorityModel,
    SetPriorityView
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

    let ContextPath = {};
    try {
        ContextPath = require("servicedesk/internal/agent/settings/automation/util/context-path/context-path");
    } catch (exception1) {
        try {
            ContextPath = require("servicedesk/internal-api/core/util/context-path/context-path");
        } catch (exception2) {
            console.error("ContextPath package not found.");
        }
    }

    const setPriorityView = function(controller) {
        const template = JSDActions.Templates.Automation.Modules.RuleThen.SetPriority.setPriorityThenActionContainer;
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

        return {
            render: function(config, errors) {
                const priorityId = config && config.priorityId ? config.priorityId : "";
                let deferred = $.Deferred();
                const url = ContextPath +  "/rest/jsdaction/1.0/jsdaction/getAllPriorities";
                deferred = Ajax.get(url);

                deferred.done(_.bind(function (data) {
                    const $template = $(template({
                        priorityId: priorityId,
                        allPriorities: data
                    }));

                    $el.html(template());

                    this.setPriorityView = new SetPriorityView({
                        model: new SetPriorityModel({
                            priorityId: priorityId,
                            allPriorities : data
                        }),
                        el: $el.find(".automation-servicedesk-intenso-set-priority-then-action-container")
                    }).render();

                    if (errors) {
                        if (errors.fieldErrors) {
                            _applyFieldErrors(errors.fieldErrors);
                        }

                        if (errors.globalErrors) {
                            _applyGlobalErrors(errors.globalErrors);
                        }
                    }
                    $el.find('#priorityIdSelect').auiSelect2();
                }, this));
                return deferred;
            },

            serialize: function () {
                return {
                    priorityId: $el.find('#priorityIdSelect').val()
                }
            },

            validate: function (deferred) {
                $el.find('.error').remove();
                let hasError = false;
                const priorityIdField = $el.find('#priorityIdSelect');
                const fieldErrors = {};

                if (!priorityIdField.val() || priorityIdField.val() == "") {
                    fieldErrors[priorityIdField.attr('name')] = "Priority is required";
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
                if (this.setPriorityView) {
                    this.setPriorityView.dispose && this.setPriorityView.dispose();
                }
            }
        }
    };

    return function(controller) {
        return setPriorityView(controller);
    };
});