define("servicedesk/intenso/actions/automation/reporteremailcontains-if-condition-model", [],
function () {

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

    return Brace.Model.extend({
        namedAttributes: {
            emailPart: String
        },
        defaults: {
            emailPart: ""
        }
    });
});