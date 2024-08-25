define("servicedesk/intenso/actions/automation/reporteremailcontains-if-condition-form", [
    "servicedesk/intenso/actions/automation/reporteremailcontains-if-condition-model",
    "servicedesk/intenso/actions/automation/reporteremailcontains-if-condition-view"
], function (
    ReporterEmailContainsModel,
    ReporterEmailContainsView
) {

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

    const reporterEmailContainsView = function(controller) {
        const template = JSDActions.Templates.Automation.Modules.RuleIf.ReporterEmailContains.reporterEmailContainsIfConditionContainer;
        const $el = $(controller.el);

        controller.on('destroy', onDestroy.bind(this));

        controller.on('error', onError.bind(this));

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


        return {

            render: function(config, errors) {
                const emailPart = config && config.emailPart ? config.emailPart : "";

                $el.html(template());

                this.reporterEmailContainsView = new ReporterEmailContainsView({
                    model: new ReporterEmailContainsModel({
                        emailPart: emailPart
                    }),
                    el: $el.find(".automation-servicedesk-reporter-email-contains-if-condition-container")
                }).render();

                if (errors) {
                    if (errors.fieldErrors) {
                        _applyFieldErrors(errors.fieldErrors);
                    }

                    if (errors.globalErrors) {
                        _applyGlobalErrors(errors.globalErrors);
                    }
                }

                return this;
            },

            serialize: function () {
                return {
                    emailPart: $el.find('input').val()
                }
            },

            validate: function (deferred) {
                $el.find('.error').remove();
                let hasError = false;
                const emailPartField = $el.find('input');
                const fieldErrors = {};

                if (!emailPartField.val()) {
                    fieldErrors[emailPartField.attr('name')] = "Field Email contains is required.";
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
                if (this.reporterEmailContainsView) {
                    this.reporterEmailContainsView.dispose && this.reporterEmailContainsView.dispose();
                }
            }
        }
    };

    return function(controller) {
        return reporterEmailContainsView(controller);
    };
});