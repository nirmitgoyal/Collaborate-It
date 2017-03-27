$(document).ready(function() {
    $.ajaxSetup({ async: true });
    var selfEasyrtcid = "";
    easyrtc.setSocketUrl(":8080"); // as in: 

    $("#demoContainer").hide();
    $("#sendMessageArea").hide();

    $("#message").click(function() {
        // easyrtc.disconnect();
        $("#demoContainer").hide();
        $("#sendMessageArea").show();
        connect_message();
    });

    $("#video").click(function() {
        // easyrtc.disconnect();
        $("#demoContainer").show();
        $("#sendMessageArea").hide();
        connect_video();
    });


    // connect(); //call connect for instant messaging

    // contents of the editor at any step
    var editorContent;
    // language selected
    var languageSelected = "CPP";
    // editor-theme
    var editorThemeSelected = "LIGHT";
    // indent-spaces
    var indentSpaces = 4;

    // HackerEarth API endpoints
    var COMPILE_URL = "compile/"
    var RUN_URL = "run/"

    //Language Boilerplate Codes
    var langBoilerplate = {}
    langBoilerplate['C'] = "#include <stdio.h>\nint main(void) {\n  // your code goes here\n    return 0;\n}\n";
    langBoilerplate['CPP'] = "#include <iostream>\nusing namespace std;\n\nint main() {\n   // your code goes here\n    return 0;\n}\n";
    langBoilerplate['JAVA'] = "public class TestDriver {\n    public static void main(String[] args) {\n        // Your code goes here\n    }\n}";
    langBoilerplate['PHP'] = "<?php\n\n// your code goes here\n";
    langBoilerplate['PYTHON'] = "def main():\n    # Your code goes here\n\nif __name__ == \"__main__\":\n    main()";
    langBoilerplate['OBJECTIVEC'] = "#import <objc/objc.h>\n#import <objc/Object.h>\n#import <Foundation/Foundation.h>\n\n@implementation TestObj\nint main()\n{\n  // your code goes here\n    return 0;\n}\n@end";
    langBoilerplate['PERL'] = "#!/usr/bin/perl\n# your code goes here\n";
    langBoilerplate['R'] = "# your code goes here";
    langBoilerplate['RUBY'] = "# your code goes here";
    langBoilerplate['SCALA'] = "object Main extends App {\n // your code goes here\n}\n";
    //// Initialize Firebase.
    //// TODO: replace with your Firebase project configuration.
    var config = {
        apiKey: "AIzaSyD5TVl2jSrzh54OYxBThMZPYQg7U8WTxKs",
        authDomain: "collaborate-it.firebaseapp.com",
        databaseURL: "https://collaborate-it.firebaseio.com",
    };
    firebase.initializeApp(config);
    //// Get Firebase Database reference.
    var firepadRef = getRef();
    var href = window.location.href;
    document.getElementById("url").innerHTML = href;
    document.getElementById("url").setAttribute("href", href);


    // flag to block requests when a request is running
    var request_ongoing = false;

    // set base path of ace editor. Required by WhiteNoise
    ace.config.set("basePath", "/static/CollaborateIt/ace-builds/src/");
    // trigger extension
    ace.require("ace/ext/language_tools");
    // init the editor
    var editor = ace.edit("editor");

    // initial configuration of the editor
    // editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/c_cpp");
    editor.getSession().setTabSize(indentSpaces);
    editorContent = editor.getValue();
    editor.setFontSize(15);
    editor.$blockScrolling = Infinity;
    // enable autocompletion and snippets
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });


    // create a simple selection status indicator
    var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
    var statusBar = new StatusBar(editor, document.getElementById("editor-statusbar"));

    var firepad = Firepad.fromACE(firepadRef, editor, {
        // include boilerplate code for selected default language
        defaultText: langBoilerplate[languageSelected]
            // defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
    });

    checkForInitialData();

    // Helper to get hash from end of URL or generate a random one.
    function getRef() {
        var ref = firebase.database().ref();
        var hash = window.location.hash.replace(/#/g, '');
        if (hash) {
            ref = ref.child(hash);
        } else {
            ref = ref.push(); // generate unique location.
            window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
        }
        if (typeof console !== 'undefined') {
            console.log('Firebase data: ', ref.toString());
        }
        return ref;
    }

    function showResultBox() {
        $(".output-response-box").show();
        $(".run-status").show();
        $(".time-sec").show();
        $(".memory-kb").show();
        var compile_status = document.getElementById('compile_status').value;
        var run_status_status = document.getElementById('run_status_status').value;
        var run_status_time = document.getElementById('run_status_time').value;
        var run_status_memory = document.getElementById('run_status_memory').value;
        var run_status_output = document.getElementById('run_status_output').value;
        var run_status_stderr = document.getElementById('run_status_stderr').value;

        if (compile_status == "OK") {
            if (run_status_status == "AC") {
                $(".output-io").show();
                $(".output-error-box").hide();
                $(".output-io-info").show();
                $(".compile-status").children(".value").html(compile_status);
                $(".run-status").children(".value").html(run_status_status);
                $(".time-sec").children(".value").html(run_status_time);
                $(".memory-kb").children(".value").html(run_status_memory);
                $(".output-o").html(run_status_output);
            } else {
                $(".output-io").show();
                $(".output-io-info").hide();
                $(".output-error-box").show();
                $(".compile-status").children(".value").html(compile_status);
                $(".run-status").children(".value").html(run_status_status);
                $(".time-sec").children(".value").html(run_status_time);
                $(".memory-kb").children(".value").html(run_status_memory);
                $(".error-key").html("Run-time error (stderr)");
                $(".error-message").html(run_status_stderr);
            }
        } else {
            $(".output-io").show();
            $(".output-io-info").hide();
            $(".compile-status").children(".value").html("--");
            $(".run-status").children(".value").html("CE");
            $(".time-sec").children(".value").html("0.0");
            $(".memory-kb").children(".value").html("0");
            $(".error-key").html("Compile error");
            $(".error-message").html(compile_status);
        }
    }

    function checkForInitialData() {
        var code_content = document.getElementById('saved_code_content').value;
        var code_lang = document.getElementById('saved_code_lang').value;
        var code_input = document.getElementById('saved_code_input').value;
        if (code_content != "" && code_content != undefined && code_content != null) {
            languageSelected = code_lang;
            $('option:selected')[0].selected = false;
            $("option[value='" + code_lang + "']")[0].selected = true;
            editor.setValue(code_content);
            $(".output-i").html(code_input);
            $('#custom-input').val(code_input);
            showResultBox();
        }
    }

    // $('#copy_code').on('mousedown', function() {
    //     initialVal = $('#copy_code')[0].innerHTML;
    //     $('#copy_link')[0].value = $('#copy_code').text();
    //     $('#copy_link').select();
    //     document.execCommand('copy');
    //     this.innerHTML = '<kbd>Link Copied To Clipboard</kbd>';
    //     $('body').on('mouseup', function() {
    //         $('#copy_code')[0].innerHTML = initialVal;
    //     });
    // });

    /**
     * function to update editorContent with current content of editor
     *
     */
    function updateContent() {
        editorContent = editor.getValue();
    }

    /**
     * function to translate the language to a file extension, txt as fallback
     *
     */
    function translateLangToExt(ext) {
        return {
            "C": "c",
            "CPP": "cpp",
            "JAVA": "java",
            "PHP": "php",
            "PYTHON": "py"

        }[ext] || "txt";
    }

    /**
     * function to download a file with given filename with text as it's contents
     *
     */
    function downloadFile(filename, text, lang) {

        var ext = translateLangToExt(lang);

        var zip = new JSZip()
        zip.file(filename + "." + ext, text)
        var downloaded = zip.generate({ type: "blob" })
        saveAs(downloaded, "test.zip")

    }

    /**
     * function to send AJAX request to 'compile/' endpoint
     *
     */
    function compileCode() {

        // if a compile request is ongoing
        if (request_ongoing)
            return;

        // hide previous compile/output results
        $(".output-response-box").hide();

        // Change button text when this method is called
        $("#compile-code").html("Compiling..");

        // disable buttons when this method is called
        $("#compile-code").prop('disabled', true);
        $("#run-code").prop('disabled', true);

        // take recent content of the editor for compiling
        updateContent();

        var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();

        // if code_id present in url and updated compile URL
        if (window.location.href.includes('code_id')) {
            COMPILE_URL = '/../compile/';
        }

        var compile_data = {
            source: editorContent,
            lang: languageSelected,
            csrfmiddlewaretoken: csrf_token
        };

        request_ongoing = true;

        // AJAX request to Django for compiling code
        $.ajax({
            url: COMPILE_URL,
            type: "POST",
            data: compile_data,
            dataType: "json",
            timeout: 10000,
            success: function(response) {

                request_ongoing = false;

                // Change button text when this method is called
                $("#compile-code").html("Compile");

                // enable button when this method is called
                $("#compile-code").prop('disabled', false);
                $("#run-code").prop('disabled', false);

                $("html, body").delay(500).animate({
                    scrollTop: $('#show-results').offset().top
                }, 1000);

                $(".output-response-box").show();
                $(".run-status").hide();
                $(".time-sec").hide();
                $(".memory-kb").hide();

                if (response.message == undefined) {
                    if (response.compile_status == "OK") {
                        $(".output-io").hide();
                        $(".compile-status").children(".value").html("OK");
                    } else {
                        $(".output-io").show();
                        $(".output-error-box").show();
                        $(".output-io-info").hide();
                        $(".compile-status").children(".value").html("--");
                        $(".error-key").html("Compile error");
                        $(".error-message").html(response.compile_status);
                    }
                } else {
                    $(".output-io").show();
                    $(".output-error-box").show();
                    $(".output-io-info").hide();
                    $(".compile-status").children(".value").html("--");
                    $(".error-key").html("Server error");
                    $(".error-message").html(response.message);
                }
            },
            error: function(error) {

                request_ongoing = false;

                // Change button text when this method is called
                $("#compile-code").html("Compile");

                // enable button when this method is called
                $("#compile-code").prop('disabled', false);
                $("#run-code").prop('disabled', false);

                $("html, body").delay(500).animate({
                    scrollTop: $('#show-results').offset().top
                }, 1000);

                $(".output-response-box").show();
                $(".run-status").hide();
                $(".time-sec").hide();
                $(".memory-kb").hide();

                $(".output-io").show();
                $(".output-error-box").show();
                $(".output-io-info").hide();
                $(".compile-status").children(".value").html("--");
                $(".error-key").html("Server error");
                $(".error-message").html("Server couldn't complete request. Please try again!");
            }
        });

    }


    /**
     * function to send AJAX request to 'run/' endpoint
     *
     */
    function runCode() {

        // if a run request is ongoing
        if (request_ongoing)
            return;

        // hide previous compile/output results
        $(".output-response-box").hide();

        // Change button text when this method is called
        $("#run-code").html("Running..");

        // disable button when this method is called
        $("#compile-code").prop('disabled', true);
        $("#run-code").prop('disabled', true);

        // take recent content of the editor for compiling
        updateContent();

        var csrf_token = $(":input[name='csrfmiddlewaretoken']").val();

        // if code_id present in url and update run URL
        if (window.location.href.includes('code_id')) {
            RUN_URL = '/../run/';
        }

        var input_given = $("#custom-input").val();

        request_ongoing = true;

        if ($("#custom-input-checkbox").prop('checked') == true) {
            var run_data = {
                source: editorContent,
                lang: languageSelected,
                input: input_given,
                csrfmiddlewaretoken: csrf_token
            };
            // AJAX request to Django for running code with input
            $.ajax({
                url: RUN_URL,
                type: "POST",
                data: run_data,
                dataType: "json",
                timeout: 10000,
                success: function(response) {
                    request_ongoing = false;

                    // if (location.port == "")
                    //     $('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + '/code_id=' + response.code_id + '/</kbd>';
                    // else
                    //     $('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + ':' + location.port + '/code_id=' + response.code_id + '/</kbd>';

                    // $('#copy_code').css({ 'display': 'initial' });

                    // Change button text when this method is called
                    $("#run-code").html("Run");

                    // enable button when this method is called
                    $("#compile-code").prop('disabled', false);
                    $("#run-code").prop('disabled', false);

                    $("html, body").delay(500).animate({
                        scrollTop: $('#show-results').offset().top
                    }, 1000);

                    $(".output-response-box").show();
                    $(".run-status").show();
                    $(".time-sec").show();
                    $(".memory-kb").show();

                    if (response.compile_status == "OK") {
                        if (response.run_status.status == "AC") {
                            $(".output-io").show();
                            $(".output-error-box").hide();
                            $(".output-io-info").show();
                            $(".compile-status").children(".value").html(response.compile_status);
                            $(".run-status").children(".value").html(response.run_status.status);
                            $(".time-sec").children(".value").html(response.run_status.time_used);
                            $(".memory-kb").children(".value").html(response.run_status.memory_used);
                            $(".output-o").html(response.run_status.output_html);
                            $(".output-i").html(input_given);
                        } else {
                            $(".output-io").show();
                            $(".output-io-info").hide();
                            $(".output-error-box").show();
                            $(".compile-status").children(".value").html(response.compile_status);
                            $(".run-status").children(".value").html(response.run_status.status);
                            $(".time-sec").children(".value").html(response.run_status.time_used);
                            $(".memory-kb").children(".value").html(response.run_status.memory_used);
                            $(".error-key").html("Run-time error (stderr)");
                            $(".error-message").html(response.run_status.stderr);
                        }
                    } else {
                        $(".output-io").show();
                        $(".output-io-info").hide();
                        $(".compile-status").children(".value").html("--");
                        $(".run-status").children(".value").html("CE");
                        $(".time-sec").children(".value").html("0.0");
                        $(".memory-kb").children(".value").html("0");
                        $(".error-key").html("Compile error");
                        $(".error-message").html(response.compile_status);
                    }
                },
                error: function(error) {

                    request_ongoing = false;

                    // Change button text when this method is called
                    $("#run-code").html("Run");

                    // enable button when this method is called
                    $("#compile-code").prop('disabled', false);
                    $("#run-code").prop('disabled', false);

                    $("html, body").delay(500).animate({
                        scrollTop: $('#show-results').offset().top
                    }, 1000);

                    $(".output-response-box").show();
                    $(".run-status").show();
                    $(".time-sec").show();
                    $(".memory-kb").show();

                    $(".output-io").show();
                    $(".output-io-info").hide();
                    $(".compile-status").children(".value").html("--");
                    $(".run-status").children(".value").html("--");
                    $(".time-sec").children(".value").html("0.0");
                    $(".memory-kb").children(".value").html("0");
                    $(".error-key").html("Server error");
                    $(".error-message").html("Server couldn't complete request. Please try again!");
                }
            });
        } else {
            var run_data = {
                source: editorContent,
                lang: languageSelected,
                csrfmiddlewaretoken: csrf_token
            };
            // AJAX request to Django for running code without input\
            var timeout_ms = 10000;
            $.ajax({
                url: RUN_URL,
                type: "POST",
                data: run_data,
                dataType: "json",
                timeout: timeout_ms,
                success: function(response) {
                    // if (location.port == "")
                    //     $('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + '/code_id=' + response.code_id + '/</kbd>';
                    // else
                    //     $('#copy_code')[0].innerHTML = '<kbd>' + window.location.hostname + ':' + location.port + '/code_id=' + response.code_id + '/</kbd>';

                    // $('#copy_code').css({ 'display': 'initial' });

                    request_ongoing = false;

                    // Change button text when this method is called
                    $("#run-code").html("Run");

                    // enable button when this method is called
                    $("#compile-code").prop('disabled', false);
                    $("#run-code").prop('disabled', false);

                    $("html, body").delay(500).animate({
                        scrollTop: $('#show-results').offset().top
                    }, 1000);

                    $(".output-response-box").show();
                    $(".run-status").show();
                    $(".time-sec").show();
                    $(".memory-kb").show();

                    if (response.compile_status == "OK") {
                        if (response.run_status.status == "AC") {
                            $(".output-io").show();
                            $(".output-error-box").hide();
                            $(".output-io-info").show();
                            $(".output-i-info").hide();
                            $(".compile-status").children(".value").html(response.compile_status);
                            $(".run-status").children(".value").html(response.run_status.status);
                            $(".time-sec").children(".value").html(response.run_status.time_used);
                            $(".memory-kb").children(".value").html(response.run_status.memory_used);
                            $(".output-o").html(response.run_status.output_html);
                        } else {
                            $(".output-io").show();
                            $(".output-io-info").hide();
                            $(".output-error-box").show();
                            $(".compile-status").children(".value").html(response.compile_status);
                            $(".run-status").children(".value").html(response.run_status.status);
                            $(".time-sec").children(".value").html(response.run_status.time_used);
                            $(".memory-kb").children(".value").html(response.run_status.memory_used);

                            if (response.run_status.status == "TLE") {
                                // Timeout error
                                $(".error-key").html("Timeout error");
                                $(".error-message").html("Time limit exceeded.");
                            } else if (response.run_status.status == "MLE") {
                                // Memory Limit Exceeded
                                $(".error-key").html("Memory limit error");
                                $(".error-message").html("Memory limit exceeded");
                            } else {
                                // General stack error
                                $(".error-key").html("Run-time error (stderr)");
                                $(".error-message").html(response.run_status.stderr);
                            }
                        }
                    } else {
                        $(".output-io").show();
                        $(".output-io-info").hide();
                        $(".compile-status").children(".value").html("--");
                        $(".run-status").children(".value").html("CE");
                        $(".time-sec").children(".value").html("0.0");
                        $(".memory-kb").children(".value").html("0");
                        $(".error-key").html("Compile error");
                        $(".error-message").html(response.compile_status);
                    }
                },
                error: function(error) {

                    request_ongoing = false;

                    // Change button text when this method is called
                    $("#run-code").html("Run");

                    // enable button when this method is called
                    $("#compile-code").prop('disabled', false);
                    $("#run-code").prop('disabled', false);

                    $("html, body").delay(500).animate({
                        scrollTop: $('#show-results').offset().top
                    }, 1000);

                    $(".output-response-box").show();
                    $(".run-status").show();
                    $(".time-sec").show();
                    $(".memory-kb").show();

                    $(".output-io").show();
                    $(".output-io-info").hide();
                    $(".compile-status").children(".value").html("--");
                    $(".run-status").children(".value").html("--");
                    $(".time-sec").children(".value").html("0.0");
                    $(".memory-kb").children(".value").html("0");
                    $(".error-key").html("Server error");
                    $(".error-message").html("Server couldn't complete request. Please try again!");
                }
            });
        }

    }


    // // when show-settings is clicked
    // $("#show-settings").click(function(event) {

    //     event.stopPropagation();

    //     // toggle visibility of the pane
    //     $("#settings-pane").toggle();

    // });


    // //close settings dropdown
    // $(function() {
    //     $(document).click(function() {
    //         $('#settings-pane').hide();
    //     });
    // });


    // when download-code is clicked
    $("#download-code").click(function() {

        // TODO: implement download code feature
        updateContent();
        downloadFile("code", editorContent, $("#lang").val());

    });

    // when lang is changed
    $("#lang").change(function() {

        languageSelected = $("#lang").val();

        // update the language (mode) for the editor
        if (languageSelected == "C" || languageSelected == "CPP") {
            editor.getSession().setMode("ace/mode/c_cpp");
        } else {
            editor.getSession().setMode("ace/mode/" + languageSelected.toLowerCase());
        }

        //Change the contents to the boilerplate code
        editor.setValue(langBoilerplate[languageSelected]);

    });


    // // when editor-theme is changed
    // $("#editor-theme").change(function() {

    //     editorThemeSelected = $("#editor-theme").val();

    //     // update the theme for the editor
    //     if (editorThemeSelected == "DARK") {
    //         editor.setTheme("ace/theme/twilight");
    //     } else if (editorThemeSelected == "LIGHT") {
    //         editor.setTheme("ace/theme/dawn");
    //     }

    // });

    //close dropdown after focus is lost
    var mouse_inside = false;
    $('#settings-pane').hover(function() {
        mouse_inside = true;
    }, function() {
        mouse_inside = false;
    });
    $('body').mouseup(function() {
        if (!mouse_inside)
            $('#settings-pane').hide();
    });

    // when indent-spaces is changed
    $("#indent-spaces").change(function() {

        indentSpaces = $("#indent-spaces").val();

        // update the indent size for the editor
        if (indentSpaces != "") {
            editor.getSession().setTabSize(indentSpaces);
        }

    });


    // to listen for a change in contents of the editor
    editor.getSession().on('change', function(e) {

        updateContent();

        // disable compile & run buttons when editor is empty
        if (editorContent != "") {
            $("#compile-code").prop('disabled', false);
            $('#compile-code').prop('title', "Press Shift+Enter");
            $("#run-code").prop('disabled', false);
            $('#run-code').prop('title', "Press Ctrl+Enter");
        } else {
            $("#compile-code").prop('disabled', true);
            $('#compile-code').prop('title', "Editor has no code");
            $("#run-code").prop('disabled', true);
            $('#run-code').prop('title', "Editor has no code");
        }

    });


    // toggle custom input textarea
    $('#custom-input-checkbox').click(function() {

        $(".custom-input-container").slideToggle();

    });


    // // assigning a new key binding for shift-enter for compiling the code
    // editor.commands.addCommand({

    //     name: 'codeCompileCommand',
    //     bindKey: { win: 'Shift-Enter', mac: 'Shift-Enter' },
    //     exec: function(editor) {

    //         updateContent();
    //         if (editorContent != "") {
    //             compileCode();
    //         }

    //     },
    //     readOnly: false // false if this command should not apply in readOnly mode

    // });


    // assigning a new key binding for ctrl-enter for running the code
    editor.commands.addCommand({

        name: 'codeRunCommand',
        bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
        exec: function(editor) {

            updateContent();
            if (editorContent != "") {
                runCode();
            }

        },
        readOnly: false // false if this command should not apply in readOnly mode

    });


    // // when compile-code is clicked
    $("#compile-code").click(function() {

        compileCode();

    });


    // when run-code is clicked
    $("#run-code").click(function() {

        runCode();

    });

    // check if input box is to be show
    if ($('#custom-input').val() != "") {
        $('#custom-input-checkbox').click();
    }



    // instant messaging code

    // var nameValue = document.getElementById("usr").value;

    function addToConversation(who, msgType, content) {
        // Escape html special characters, then add linefeeds.
        content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        content = content.replace(/\n/g, '<br />');
        document.getElementById('conversation').innerHTML +=
            "<b>" + who + ":</b>&nbsp;" + content + "<br />";
    }


    function connect_message() {
        easyrtc.setPeerListener(addToConversation);
        easyrtc.setRoomOccupantListener(convertListToButtons_message);
        console.log("1");
        easyrtc.connect("easyrtc.instantMessaging", loginSuccess_message, loginFailure_message);
        console.log("2");

    }

    function connect_video() {
        easyrtc.setVideoDims(640, 480);
        easyrtc.setRoomOccupantListener(convertListToButtons_video);
        easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess_video, loginFailure_video);
    }


    function convertListToButtons_message(roomName, occupants, isPrimary) {
        var otherClientDiv = document.getElementById('otherClients');

        while (otherClientDiv.hasChildNodes()) {
            otherClientDiv.removeChild(otherClientDiv.lastChild);
        }
        var button = document.createElement('button');
        button.className = "btn btn-primary";
        var label = document.createTextNode("Send");
        button.appendChild(label);
        button.onclick = function() {
            sendStuffWS(occupants);
        };

        otherClientDiv.appendChild(button);
    }


    function convertListToButtons_video(roomName, data, isPrimary) {
        var otherClientDiv_video = document.getElementById("otherClients_video");

        while (otherClientDiv_video.hasChildNodes()) {
            otherClientDiv_video.removeChild(otherClientDiv_video.lastChild);
        }

        var button = document.createElement('button');
        button.className = "btn btn-primary";
        var label = document.createTextNode("Send your Video");
        button.appendChild(label);
        button.onclick = function() {
            performCall(data);
        };

        otherClientDiv_video.appendChild(button);
    }


    function performCall(occupants) {
        easyrtc.hangupAll();

        var successCB = function() {};
        var failureCB = function() {};
        for (var easyrtcid in occupants) {
            easyrtc.call(easyrtcid, successCB, failureCB);
        }
    }


    function sendStuffWS(occupants) {
        // console.log("inside sendStuffWS");
        var text = document.getElementById('sendMessageText').value;
        // console.log("text: " + text);
        if (text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
            return;
        }

        for (var easyrtcid in occupants) {
            easyrtc.sendDataWS(easyrtcid, "message", text);
        }

        addToConversation("Me", "message", text);
        document.getElementById('sendMessageText').value = "";
    }


    function loginSuccess_message(easyrtcid) {
        selfEasyrtcid = easyrtcid;
        document.getElementById("iam").innerHTML = "You: " + "<b>" + easyrtcid + "</b>";
    }


    function loginFailure_message(errorCode, message) {
        easyrtc.showError(errorCode, message);
    }

    function loginSuccess_video(easyrtcid) {
        selfEasyrtcid = easyrtcid;
        document.getElementById("iam_video").innerHTML = "You: " + easyrtc.cleanId(easyrtcid);
    }


    function loginFailure_video(errorCode, message) {
        easyrtc.showError(errorCode, message);
    }


});
