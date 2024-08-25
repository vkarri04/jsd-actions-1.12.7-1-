AJS.$(document).ready(function() {

    const handleResponse = (resp, textStatus, xhr, sendOnComment) => {
        if(resp) {
            const fieldTableBody = AJS.$("#fieldTableBody");
            const rlabs_fields = AJS.$("#rlabs-fields").val();
            AJS.$.each(resp, function(index) {
                const option = AJS.$('#jsd-intenso-fieldId option[value="'+resp[index].s0+'"]');
                let toAppend = "<tr id=\"" + resp[index].s0 + "\" data-req=\""+resp[index].s2+"\" data-opt=\""+resp[index].s4+"\" data-read-only=\""+resp[index].s5+"\" data-use-default=\""+resp[index].s6+"\">+<td style=\"cursor: move; width: 60%;\">"+resp[index].s1+"</td>";
                if((option.attr('type') == "textfield") || (option.attr('type') == "textarea")) {
                    if(resp[index].s4 == "1") {
                        toAppend += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"jsd-field-hidechar"+resp[index].s0.replace(/\s/g, '').replace(/\//g, '')+"\" checked=\"checked\"/>Hide characters</td>";
                    } else {
                        toAppend += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"jsd-field-hidechar"+resp[index].s0.replace(/\s/g, '').replace(/\//g, '')+"\"/>Hide characters</td>";
                    }
                } else {
                    toAppend += "<td></td>";
                }
                if(resp[index].s0 != "Attachment" && resp[index].s0 != "Comment" && resp[index].s0 != "Labels" && rlabs_fields.indexOf(resp[index].s0) === -1) {
                    toAppend += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"jsd-field-usedefault"+resp[index].s0.replace(/\s/g, '').replace(/\//g, '')+"\" " + (resp[index].s6 == "1" ? "checked" : "")+ "/>Use default</td>" +
                        "<td><input type=\"checkbox\" class=\"checkbox\" id=\"jsd-field-readonly"+resp[index].s0.replace(/\s/g, '').replace(/\//g, '')+"\" " + (resp[index].s5 == "1" ? "checked" : "")+ "/>Read only</td>";
                } else if(resp[index].s0 == "Comment") {
                    if(sendOnComment) {
                        toAppend += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"notifyOnComment\" name=\"notifyOnComment\" checked=\"checked\"/>Notify on comment</td><td></td>";
                    } else {
                        toAppend += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"notifyOnComment\" name=\"notifyOnComment\" />Notify on comment</td><td></td>";
                    }
                } else if(rlabs_fields.indexOf(resp[index].s0) >= 0) {
                    toAppend += "<td></td><td><input type=\"checkbox\" class=\"checkbox\" id=\"jsd-field-readonly"+resp[index].s0.replace(/\s/g, '').replace(/\//g, '')+"\" " + (resp[index].s5 == "1" ? "checked" : "")+ "/>Read only</td>";
                }
                else {
                    toAppend += "<td></td><td></td>";
                }
                if((resp[index].s0 != "Summary") && (resp[index].s0 != "Reporter")) {
                    toAppend += "<td><a id=\"jsd-field-req" + resp[index].s0.replace(/\s/g, '').replace(/\//g, '') + "\" style=\"cursor:pointer\">"+resp[index].s3+"</a></td>";
                } else {
                    toAppend += "<td></td>";
                }
                toAppend += "<td><a class=\"aui-button jsd-field-delete-button\" style=\"height: 24px; line-height: 1\">Remove</a></td></tr>"
                fieldTableBody.append(toAppend);
                fieldTableBody.sortable();

                AJS.$('#jsd-field-req' + resp[index].s0.replace(/\s/g, '').replace(/\//g, '')).click(function() {
                    const changeReqTr = AJS.$(this).closest('tr');
                    if(changeReqTr.attr("data-req") == "0") {
                        changeReqTr.attr("data-req","1");
                        AJS.$(this).html("Make it optional");
                    } else {
                        changeReqTr.attr("data-req","0");
                        AJS.$(this).html("Make it required");
                    }
                });

                AJS.$('#jsd-field-hidechar' + resp[index].s0.replace(/\s/g, '').replace(/\//g, '')).click(function() {
                    const changeReqTr = AJS.$(this).closest('tr');
                    if(AJS.$(this).attr("checked") === "checked") {
                        changeReqTr.attr("data-opt","1");
                    } else {
                        changeReqTr.attr("data-opt","0");
                    }
                });

                AJS.$('#jsd-field-readonly' + resp[index].s0.replace(/\s/g, '').replace(/\//g, '')).click(function() {
                    const changeReqTr = AJS.$(this).closest('tr');
                    if(AJS.$(this).attr("checked") === "checked") {
                        changeReqTr.attr("data-read-only","1");
                    } else {
                        changeReqTr.attr("data-read-only","0");
                    }
                });

                AJS.$('#jsd-field-usedefault' + resp[index].s0.replace(/\s/g, '').replace(/\//g, '')).click(function() {
                    const changeReqTr = AJS.$(this).closest('tr');
                    if(AJS.$(this).attr("checked") === "checked") {
                        changeReqTr.attr("data-use-default","1");
                    } else {
                        changeReqTr.attr("data-use-default","0");
                    }
                });

                option.addClass('hidden');

            });


            AJS.$('.jsd-field-delete-button').click(function() {
                const tr = AJS.$(this).closest('tr');
                const option = AJS.$('#jsd-intenso-fieldId option[value="'+tr.attr('id')+'"]');
                option.removeClass('hidden');
                tr.remove();
                const rows = AJS.$( "#fieldTableBody tr" );
                if(rows.length == 0) {
                    AJS.$('#divAfterFieldTable').html("");
                }
            });

            AJS.$('#divAfterFieldTable').html("<br/>");

        }
    }
    AJS.$("#transitionId").auiSelect2({
        placeholder: "Select a transition",
        allowClear: true
    }).on("change", function(e) {
        AJS.$('#saveWorkflow').val('Add');
        AJS.$('#saveWorkflow').attr('order-id','');
        const f = AJS.$("#transitionId");
        const rows = AJS.$( "#transitionTable tr" );
        if(rows.length != 0) {
            AJS.$.each(rows, function(index) {
                const tr = AJS.$(this);
                let td = tr.find("td").first();
                if (td.text() == f.val()) {
                    AJS.$('#saveWorkflow').val('Save');
                    AJS.$('#saveWorkflow').attr('order-id',index-1);
                    AJS.$('#jsd-intenso-fieldId option').removeClass('hidden');
                    AJS.$('#fieldTableBody tr').remove();
                    AJS.$('#divAfterFieldTable').html("");
                    AJS.$('#customValidatorUrl').val(td.attr("customvalidatorurl"));
                    if(td.attr("addattachmentbefore") == "false") {
                        AJS.$("#beforeTransition").removeClass("activeOption");
                        AJS.$("#afterTransition").addClass("activeOption");
                        AJS.$('#addAttachmentBefore').val("false");
                    } else {
                        AJS.$("#beforeTransition").addClass("activeOption");
                        AJS.$("#afterTransition").removeClass("activeOption");
                        AJS.$('#addAttachmentBefore').val("true");
                    }
                    if(td.attr("hideemptyfields") == "true") {
                        AJS.$("#hideEmptyFields").attr("checked", "checked");
                    } else {
                        AJS.$("#hideEmptyFields").attr("checked", null);
                    }
                    const sendOnComment = (td.attr("notifyoncomment") == "true");
                    td = td.next();
                    AJS.$('#transitionName').val(td.text());
                    td = td.next();
                    AJS.$('#description-field').val(td.find("p").attr("title"));
                    td = td.next();
                    if(td.html().length > 0) {
                        const vid = tr.attr("id");

                        JIRA.SmartAjax.makeRequest({
                            url: AJS.contextPath() + "/rest/jsdaction/1.0/jsdaction/fieldsandcf",
                            data: '{ "s1" : "'+vid+'" }',
                            type: "POST",
                            contentType: "application/json",
                            dataType: "json",
                            success: (resp, textStatus, xhr) => handleResponse(resp, textStatus, xhr, sendOnComment),
                            error: function(response) {
                                JIRA.Messages.showErrorMsg("Error.");
                            }
                        });
                    } else {
                        AJS.$('#divAfterFieldTable').html("");
                    }
                }
            });
        }
    });

    AJS.$("#jsd-intenso-fieldId").auiSelect2({
        placeholder: "Select a field",
        allowClear: true
    }).on("change", function(e) {
        const f = AJS.$("#jsd-intenso-fieldId");
        if(f.auiSelect2("data") != null) {
            const option = AJS.$('#jsd-intenso-fieldId option[value="'+f.val()+'"]');
            const type = option.attr('type');
            let toAppend = "<tr id=\"" + f.val() + "\" data-req=\"0\" data-opt=\"0\" data-read-only=\"0\"><td style=\"cursor: move; width: 60%;\">"+option.html()+"</td>";
            if((type == "textfield") || (type == "textarea")) {
                toAppend += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"jsd-field-hidechar"+f.val().replace(/\s/g, '').replace(/\//g, '')+"\"/>Hide characters</td>";
            } else {
                toAppend += "<td></td>";
            }
            if((f.val() != "Attachment") && f.val() !="Comment" && f.val() != "Labels") {
                toAppend += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"jsd-field-usedefault" + f.val().replace(/\s/g, '').replace(/\//g, '') + "\"/>Use default</td>" +
                    "<td><input type=\"checkbox\" class=\"checkbox\" id=\"jsd-field-readonly" + f.val().replace(/\s/g, '').replace(/\//g, '') + "\"/>Read only</td>";
            } else if(f.val() == "Comment") {
                toAppend += "<td><input type=\"checkbox\" class=\"checkbox\" id=\"notifyOnComment\" name=\"notifyOnComment\"/>Notify on comment</td><td></td>";
            } else {
                toAppend += "<td></td><td></td>";
            }
            if((f.val() != "Summary") && (f.val() != "Reporter")) {
                toAppend += "<td><a id=\"jsd-field-req" + f.val().replace(/\s/g, '').replace(/\//g, '') + "\" style=\"cursor:pointer\">Make it required</a></td>";
            } else {
                toAppend += "<td></td>";
            }
            toAppend += "<td><a class=\"aui-button jsd-field-delete-button\" style=\"height: 24px; line-height: 1\">Remove</a></td></tr>";
            AJS.$("#fieldTableBody").append(toAppend);
            AJS.$("#fieldTableBody").sortable();

            AJS.$('#jsd-field-req' + f.val().replace(/\s/g, '').replace(/\//g, '')).click(function() {
                const changeReqTr = AJS.$(this).closest('tr');
                if(changeReqTr.attr("data-req") == "0") {
                    changeReqTr.attr("data-req","1");
                    AJS.$(this).html("Make it optional");
                } else {
                    changeReqTr.attr("data-req","0");
                    AJS.$(this).html("Make it required");
                }
            });

            AJS.$('#jsd-field-hidechar' + f.val().replace(/\s/g, '').replace(/\//g, '')).click(function() {
                const changeReqTr = AJS.$(this).closest('tr');
                if(AJS.$(this).attr("checked") === "checked") {
                    changeReqTr.attr("data-opt","1");
                } else {
                    changeReqTr.attr("data-opt","0");
                }
            });

            AJS.$('#jsd-field-readonly' + f.val().replace(/\s/g, '').replace(/\//g, '')).click(function() {
                const changeReqTr = AJS.$(this).closest('tr');
                if(AJS.$(this).attr("checked") === "checked") {
                    changeReqTr.attr("data-read-only","1");
                } else {
                    changeReqTr.attr("data-read-only","0");
                }
            });

            AJS.$('#jsd-field-usedefault' + f.val().replace(/\s/g, '').replace(/\//g, '')).click(function() {
                const changeReqTr = AJS.$(this).closest('tr');
                if(AJS.$(this).attr("checked") === "checked") {
                    changeReqTr.attr("data-use-default","1");
                } else {
                    changeReqTr.attr("data-use-default","0");
                }
            });

            f.auiSelect2("val", "");
            option.addClass('hidden');
            AJS.$('.jsd-field-delete-button').click(function() {
                const tr = AJS.$(this).closest('tr');
                const option = AJS.$('#jsd-intenso-fieldId option[value="'+tr.attr('id')+'"]');
                option.removeClass('hidden');
                tr.remove();
                const rows = AJS.$( "#fieldTableBody tr" );
                if(rows.length == 0) {
                    AJS.$('#divAfterFieldTable').html("");
                }
            });

            const rows = AJS.$( "#fieldTableBody tr" );
            if(rows.length == 1) {
                AJS.$('#divAfterFieldTable').html("<br/>");
            }
        }
    });

    AJS.$(".editTransition").click(function() {
        const tr = AJS.$(this).closest('tr');
        const value = tr.find('td').first().text();
        AJS.$('#transitionId').auiSelect2("val", value).trigger('change');
        //	AJS.$("html, body").animate({ scrollTop: AJS.$(document).height() }, "slow");
    });

    AJS.$(".jsd-action-remove-sec").on('click', function() {
        document.activeElement.blur()
        AJS.$("#delete-transition-dialog-submit-button").data("vid", AJS.$(this).attr('vid'));
        AJS.dialog2("#delete-transition-confirmation-dialog").show();
    });

    AJS.$("#delete-transition-dialog-cancel-button").on('click', function (e) {
        e.preventDefault();
        AJS.dialog2("#delete-transition-confirmation-dialog").hide();
    });

    AJS.$("#delete-transition-dialog-submit-button").click(function() {
        const vid = AJS.$( this ).data("vid");
        JIRA.SmartAjax.makeRequest({
            url: AJS.contextPath() + "/rest/jsdaction/1.0/jsdaction/removeById",
            data: vid,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            success: function(resp, textStatus, xhr) {
                AJS.$("#" + vid).remove();
                AJS.dialog2("#delete-transition-confirmation-dialog").hide();
                JIRA.Messages.showSuccessMsg("Transition has been removed.");
            },
            error: function(response) {
                JIRA.Messages.showErrorMsg("Error.");
            }
        });
    });

    AJS.$( ".jsd-action-import-start" ).click(function() {

        AJS.$(".jsd-action-import-start").prop("disabled",true);
        const pmsg = AJS.$(".refresh_p_intenso");

        AJS.$.post( AJS.params.baseURL + "/rest/sp4jsd/1.0/jsdextender/getTechUser", function( data ) {
            AJS.$.each(data, function(key, value) {
                AJS.$.ajax({
                    url: AJS.contextPath() + '/rest/jsdaction/1.0/jsdaction/importTechUser',
                    type: 'PUT',
                    contentType: "application/json",
                    dataType: "json",
                    data: '{ '+
                    ' "techUser": "'+value.s4+'", '+
                    ' "comment": "'+value.s6+'", '+
                    ' "showIcon": "'+value.s3+'", '+
                    ' "cfForUser": "'+value.s7+'",  '+
                    ' "sendEmail": "'+value.s8+'"  '+
                    '}',
                });

            });
        }).fail(function(xhr, status, error) {
            alert("You don't have installed/enabled or upgraded the Extension plugin to the latest version. Please create a support request.");
        });

        AJS.$.post( AJS.contextPath() + "/rest/sp4jsd/1.0/jsdextender/getActions", function( data ) {
            AJS.$.each(data, function(key, value) {
                AJS.$.ajax({
                    url: AJS.contextPath() + '/rest/jsdaction/1.0/jsdaction/importAction',
                    type: 'PUT',
                    contentType: "application/json",
                    dataType: "json",
                    data: '{ '+
                    ' "transitionName": "'+value.s1+'", '+
                    ' "fields": "'+value.s2+'", '+
                    ' "displayName": "'+value.s3+'", '+
                    ' "required": "'+value.s4+'", '+
                    ' "orderId": "'+value.s5+'", '+
                    ' "description": "'+value.s6+'", '+
                    ' "hideChar": "'+value.s7+'", '+
                    ' "readOnly": "'+value.s8+'", '+
                    ' "hideEmpty": "'+value.s9+'" '+
                    '}',
                });


                pmsg.html("Migration is in progress..  " + (key+1) +"/"+ data.length);
                if(data.length===(key+1))
                    pmsg.html("REFRESH the page now to complete the import");

            });
        }).fail(function(xhr, status, error) {
            alert("You don't have installed/enabled or upgraded the Extension plugin to the latest version. Please create a support request.");
        });
    });

});
