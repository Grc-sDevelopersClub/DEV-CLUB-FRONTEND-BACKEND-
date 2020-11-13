$(function(){
    var subjectButtons;

         $.getJSON('json/cseSeSubjects.json',function(result){
            subjectButtons=" <input type='hidden' name='year' value='CSESE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#compSe").html(subjectButtons);
        });
        $.getJSON('json/cseTeSubjects.json',function(result){
            subjectButtons=" <input type='hidden' name='year' value='CSETE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#compTe").html(subjectButtons);
        });
        $.getJSON('json/cseBeSubjects.json',function(result){
            subjectButtons=" <input type='hidden' name='year' value='CSEBE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#compBe").html(subjectButtons);
        });

        $.getJSON('json/itSeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='ITSE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#itSe").html(subjectButtons);
        });
        $.getJSON('json/itSeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='ITTE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#itTe").html(subjectButtons);
        });
       
        $.getJSON('json/itSeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='ITBE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#itBe").html(subjectButtons);
        });
       
       
       
    
        
    });
    