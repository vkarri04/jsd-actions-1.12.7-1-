define("servicedesk/intenso/actions/automation/add-label-then-action-form", [
    "servicedesk/intenso/actions/automation/add-label-then-action-model",
    "servicedesk/intenso/actions/automation/add-label-then-action-view"
], function (
    AddLabelModel,
    AddLabelView
 ){

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

    const addLabelView = function(controller) {
        const template = JSDActions.Templates.Automation.Modules.RuleThen.AddLabel.serviceDeskIssueLabelThenActionContainer;
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
                const issueLabel = config && config.issueLabel ? config.issueLabel : "";

                $el.html(template());

                this.addLabelView = new AddLabelView({
                    model: new AddLabelModel({
                        issueLabel: issueLabel
                    }),
                    el: $el.find(".automation-servicedesk-issue-label-then-action-container")
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
                    issueLabel: $el.find('input').val()
                }
            },

            validate: function (deferred) {
                $el.find('.error').remove();
                let hasError = false;
                const issueLabelField = $el.find('input');
                const fieldErrors = {};

                if (!issueLabelField.val()) {
                    fieldErrors[issueLabelField.attr('name')] = "Label is required.";
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
                if (this.addLabelView) {
                    this.addLabelView.dispose && this.addLabelView.dispose();
                }
            }
        }
    };

    return function(controller) {
        return addLabelView(controller);
    };
});