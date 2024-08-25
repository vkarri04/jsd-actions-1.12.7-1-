AJS.$(function () {
	
	JIRA.Dialogs.fieldsPreviewDialog = new JIRA.FormDialog({
		id: "jsd-action-fields-preview-dialog",
		trigger: ".jsd-action-fields-preview",
		widthClass: "small",
		ajaxOptions: JIRA.Dialogs.getDefaultAjaxOptions,
		onSuccessfulSubmit : function(){
		},
		onDialogFinished : function() {
			
		},
		onContentRefresh: function () {
	    }
	});

	JIRA.Dialogs.fieldsPreviewDialog = new JIRA.FormDialog({
		id: "jsd-action-translate-transition-dialog",
		trigger: ".jsd-action-translate-transition",
		widthClass: "medium",
		ajaxOptions: JIRA.Dialogs.getDefaultAjaxOptions,
		onSuccessfulSubmit : function(){
		},
		onDialogFinished : function() {

		},
		onContentRefresh: function () {
		}
	});

});