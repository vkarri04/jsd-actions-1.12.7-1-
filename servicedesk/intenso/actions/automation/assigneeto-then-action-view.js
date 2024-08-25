define("servicedesk/intenso/actions/automation/assigneeto-then-action-view", [],
function () {

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

    let Brace = {};
    try {
        Brace = require("automation/backbone-brace");
    } catch (exception1) {
        try {
            Brace = require("servicedesk/backbone-brace");
        } catch (exception2) {
            console.error("Backbone-brace package not found.");
        }
    }

    let FormMixin = {};
    try {
        FormMixin = require("servicedesk/internal/agent/settings/automation/util/form-mixin/form-mixin");
    } catch (exception1) {
        try {
            FormMixin = require("servicedesk/internal-api/core/util/form-mixin/form-mixin");
        } catch (exception2) {
            console.error("Form-mixin package not found.");
        }
    }

    return Brace.View.extend({
        template: JSDActions.Templates.Automation.Modules.RuleThen.AssigneeTo.assigneeToForm,
        mixins: [FormMixin],

        dispose: function() {
            this.undelegateEvents();
            this.stopListening();
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});