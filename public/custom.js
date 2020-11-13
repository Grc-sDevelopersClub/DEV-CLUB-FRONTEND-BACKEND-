$(function(){
var departmentOptions;
var yearOptions;
var subjectOptions;


	$.getJSON('json/department.json',function(result){
		$.each(result, function(i,department) {
			//<option value='countrycode'>contryname</option>
			departmentOptions+="<option value='"
			+department.code+
			"'>"
			+department.name+
			"</option>";
			 });
			 $('#departmentMenu').html(departmentOptions);
	});
	$("#departmentMenu").change(function(){
	if($(this).val()==="FE"){
		
			$.getJSON('json/year.json',function(result){
				yearOptions="";
			$.each(result, function(i,year) {
				//<option value='stateCode'>stateName</option>
				
				yearOptions+="<option value='"
			+year.code+
			"'>"
			+year.name+
			"</option>";
			 });
				 $('#yearMenu').html(yearOptions);
			});
		} else if($(this).val()==="CSE") {

			$.getJSON('json/cseyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="IT") {

			$.getJSON('json/ityear.json',function(result){

				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="E&TC") {

			$.getJSON('json/e&tcyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="AUTO") {

			$.getJSON('json/autoyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="MECH") {

			$.getJSON('json/mechyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="CIVIL") {

			$.getJSON('json/civilyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  
	});
	
	$("#yearMenu").change(function(){
	if($(this).val()==="FE"){
			$.getJSON('json/feSubjects.json',function(result){
				subjectOptions="";
			$.each(result, function(i,subject) {
				//<option value='districtName'>districtName</option>
				subjectOptions+="<option value='"
				+subject.code+
				"'>"
				+subject.name+
				"</option>";
				 });
				 $('#subject').html(subjectOptions);
			});
		}else if($(this).val()==="CSESE"){
			$.getJSON('json/cseSeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="CSETE"){
			$.getJSON('json/cseTeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="CSEBE"){
			$.getJSON('json/cseBeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="ITSE"){
			$.getJSON('json/itSeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="ITTE"){
			$.getJSON('json/itTeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="ITBE"){
			$.getJSON('json/itBeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="E&TCSE"){
			$.getJSON('json/e&tcSeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="E&TCTE"){
			$.getJSON('json/e&tcTeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="E&TCBE"){
			$.getJSON('json/e&tcBeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="MECHSE"){
			$.getJSON('json/mechSeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="MECHTE"){
			$.getJSON('json/mechTeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="MECHBE"){
			$.getJSON('json/mechBeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="CIVILSE"){
			$.getJSON('json/civilSeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="CIVILTE"){
			$.getJSON('json/civilTeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}else if($(this).val()==="CIVILBE"){
			$.getJSON('json/civilBeSubjects.json',function(result){
				subjectOptions="";
				$.each(result, function(i,subject) {
					//<option value='districtName'>districtName</option>
					subjectOptions+="<option value='"
					+subject.code+
					"'>"
					+subject.name+
					"</option>";
					 });
					 $('#subject').html(subjectOptions);
				});
		}

	});
	
});
