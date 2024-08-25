define("servicedesk/intenso/actions/automation/reporterlanguage-if-condition-form", [
    "servicedesk/intenso/actions/automation/reporterlanguage-if-condition-model",
    "servicedesk/intenso/actions/automation/reporterlanguage-if-condition-view"
], function (
    ReporterLanguageModel,
    ReporterLanguageView
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

    const reporterLanguageView = function(controller) {
        const template = JSDActions.Templates.Automation.Modules.RuleIf.ReporterLanguage.reporterLanguageIfConditionContainer;
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
                const reporterLang = config && config.reporterLang ? config.reporterLang : "";
                let deferred = $.Deferred();
                const url = AJS.contextPath() + "/rest/jsdaction/1.0/jsdaction/getAllLanguages";
                deferred = Ajax.get(url);

                deferred.done(_.bind(function (data) {
                    const $template = $(template({
                        reporterLang: reporterLang,
                        allLanguages: data
                    }));

                    $el.html(template());

                    this.reporterLanguageView = new ReporterLanguageView({
                        model: new ReporterLanguageModel({
                            reporterLang: reporterLang,
                            allLanguages: data
                        }),
                        el: $el.find(".automation-servicedesk-intenso-reporter-language-if-condition-container")
                    }).render();

                    if (errors) {
                        if (errors.fieldErrors) {
                            _applyFieldErrors(errors.fieldErrors);
                        }

                        if (errors.globalErrors) {
                            _applyGlobalErrors(errors.globalErrors);
                        }
                    }
                    $el.find('#reporterLangSelect').auiSelect2();
                }, this));
                return deferred;
            },

            serialize: function () {
                return {
                    reporterLang: $el.find('#reporterLangSelect').val()
                }
            },

            validate: function (deferred) {
                $el.find('.error').remove();
                let hasError = false;
                const reporterLangField = $el.find('#reporterLangSelect');
                const fieldErrors = {};

                if (!reporterLangField.val() || reporterLangField.val() == "") {
                    fieldErrors[reporterLangField.attr('name')] = "Language is required";
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
                if (this.reporterLanguageView) {
                    this.reporterLanguageView.dispose && this.reporterLanguageView.dispose();
                }
            }
        }
    };

    return function(controller) {
        return reporterLanguageView(controller);
    };
});