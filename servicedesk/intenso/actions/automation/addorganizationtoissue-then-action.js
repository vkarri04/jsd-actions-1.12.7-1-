define("servicedesk/intenso/actions/automation/addorganizationtoissue-then-action-form", [
    "servicedesk/intenso/actions/automation/addorganizationtoissue-then-action-model",
    "servicedesk/intenso/actions/automation/addorganizationtoissue-then-action-view"
], function (
    AddOrganizationsModel,
    AddOrganizationsView
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

    const addOrganizationsView = function(controller) {
        const template = JSDActions.Templates.Automation.Modules.RuleThen.AddOrganizations.addOrganizationsThenActionContainer;
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

        function onDeffered (data, errors, organizationsIds) {
            const $template = $(template({
                organizationsIds: organizationsIds,
                organizations: data
            }));

            $el.html(template());

            this.addOrganizationsView = new AddOrganizationsView({
                model: new AddOrganizationsModel({
                    organizationsIds: organizationsIds,
                    organizations: data.map(function(o) {return {v1: o.v1, v2: o.v2, v3: organizationsIds.indexOf(o.v1) >= 0}})
                }),
                el: $el.find(".automation-servicedesk-intenso-add-organizations-then-action-container")
            }).render();
            if (errors) {
                if (errors.fieldErrors) {
                    _applyFieldErrors(errors.fieldErrors);
                }

                if (errors.globalErrors) {
                    _applyGlobalErrors(errors.globalErrors);
                }
            }
            $el.find('#organizationsIds').select2intenso();
        }

        function onRender (config, errors) {
            const organizationsIds = config && config.organizationsIds ? config.organizationsIds.split(",") : [];
            let deferred = $.Deferred();
            const url = ContextPath + "/rest/jsdaction/1.0/jsdaction/getProjectOrganizations?projectId="+AJS.Meta.get("projectId");
            deferred = Ajax.get(url);
            deferred.done(_.bind((data) => onDeffered(data, errors, organizationsIds), this));

            return deferred;
        }

        return {
            render: onRender,

            serialize: function () {
                return {
                    organizationsIds: $el.find('#organizationsIds').val().toString()
                }
            },

            validate: function (deferred) {
                $el.find('.error').remove();
                let hasError = false;
                const organizationsField = $el.find('#organizationsIds');
                const fieldErrors = {};

                if (!organizationsField.val() || organizationsField.val().length == 0) {
                    fieldErrors[organizationsField.attr('name')] = "Field Organizations is required.";
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
                if (this.addOrganizationsView) {
                    this.addOrganizationsView.dispose && this.addOrganizationsView.dispose();
                }
            }
        }

    };

    return function(controller) {
        return addOrganizationsView(controller);
    };

});
