var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stdDBName = "STUDENT-TABLE";
var stdRelationName = "SCHOOL-DB";
var connToken = "90934819|-31949261949182026|90958335";

$("#stdRollNo").focus();
disableAll();

function disableAll() {
    $("#stdName, #stdClass, #stdBirthDate, #stdAddress, #enrollmentDate")
        .prop("disabled", true);
    $("#save, #update, #reset").prop("disabled", true);
}

function enableFields() {
    $("#stdName, #stdClass, #stdBirthDate, #stdAddress, #enrollmentDate")
        .prop("disabled", false);
}

function saveRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", data.rec_no);
}

function getStdRollNoAsJsonObj() {
    var stdRollNo = $("#stdRollNo").val();
    return JSON.stringify({ id: stdRollNo });
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;

    $("#stdName").val(record.name);
    $("#stdClass").val(record.class);
    $("#stdBirthDate").val(record.birthDate);
    $("#stdAddress").val(record.address);
    $("#enrollmentDate").val(record.enrollmentDate);
}

function resetData() {
    $("#stdRollNo").val("");
    $("#stdName").val("");
    $("#stdClass").val("");
    $("#stdBirthDate").val("");
    $("#stdAddress").val("");
    $("#enrollmentDate").val("");
    $("#stdRollNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop('disabled', true);
    $("#stdRollNo").focus();
}

function validateData() {
    var stdRollNo = $("#stdRollNo").val();
    var stdName = $("#stdName").val();
    var stdClass = $("#stdClass").val();
    var stdBirthDate = $("#stdBirthDate").val();
    var stdAdress = $("#stdAddress").val();
    var enrollmentDate = $("#enrollmentDate").val();

    if (stdRollNo === "") {
        alert("Student Roll No missing");
        $("#stdRollNo").focus();
        return "";
    }
    if (stdName === "") {
        alert("Student Name missing");
        $("#stdName").focus();
        return "";
    }
    if (stdClass === "") {
        alert("Student Class missing");
        $("#stdClass").focus();
        return "";
    }
    if (stdBirthDate === "") {
        alert("Birth Date missing");
        $("#stdBirthDate").focus();
        return "";
    }
    if (stdAdress === "") {
        alert("Address missing");
        $("#stdAddress").focus();
        return "";
    }
    if (enrollmentDate === "") {
        alert("Enrollment Date missing");
        $("#enrollmentDate").focus();
        return "";
    }

    var jsonStrObj = {
        id: stdRollNo,
        name: stdName,
        class: stdClass,
        birthDate: stdBirthDate,
        address: stdAdress,
        enrollmentDate: enrollmentDate
    };

    return JSON.stringify(jsonStrObj);
}

function getStd() {
    var stdRollNoJsonObj = getStdRollNoAsJsonObj();

    var getRequest = createGET_BY_KEYRequest(
        connToken,
        stdDBName,
        stdRelationName,
        stdRollNoJsonObj
    );

    $.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(
        getRequest,
        jpdbBaseURL,
        jpdbIRL
    );
    $.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        enableFields();
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stdName").focus();
    }
    else if (resJsonObj.status === 200) {
        $("#stdRollNo").prop("disabled", true);
        fillData(resJsonObj);
        enableFields();
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stdName").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;

    var putRequest = createPUTRequest(
        connToken,
        jsonStrObj,
        stdDBName,
        stdRelationName
    );

    $.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(
        putRequest,
        jpdbBaseURL,
        jpdbIML
    );
    $.ajaxSetup({ async: true });

    alert("Record Saved");
    resetData();
    $("#stdRollNo").focus();
}

function UpdateData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") return;

    var updateRequest = createUPDATERecordRequest(
        connToken,
        jsonStrObj,
        stdDBName,
        stdRelationName,
        localStorage.getItem("recno")
    );

    $.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(
        updateRequest,
        jpdbBaseURL,
        jpdbIML
    );
    $.ajaxSetup({ async: true });

    alert("Record Updated");
    resetData();
}
