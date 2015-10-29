function splitAddress(div) {
    var zipadd;
    var div_array = div;
    if(div_array[1].indexOf('〒') == 0){ // this is normal
        zipadd = div_array[1].split("　").join(",");
        div_array.splice(1, 1, zipadd);
    } else if(div_array[2].indexOf('〒') == 0){ // this means that there is junk before address
        zipadd = div_array[2].split("　").join(",");
        div_array.splice(1, 2, zipadd); // so get rid of junk and old non-split address
    }
    return div_array;
}

function replacePostSign (div_item) {
    div_item = div_item.replace( /^〒/, '' ); // find and replace postal sign
    return div_item;
}
var ct = 8;
var pageloads = true;
var page, url;
page = require('webpage').create();
// while (pageloads == true){ // can't get this to work

    // url = 'http://itp.ne.jp/result/?kw=%8D%81%90%EC%8C%A7+%90%C5%97%9D%8E%6D&dcad=34&sr=1&st=4&evdc=1&num=50&pg='+ct;
    url = 'file:///Users/collinjames/Desktop/kagawa/itp'+ct+'.html';

    // suppress errors! see http://stackoverflow.com/questions/19459247/how-to-ignore-errors-in-phamtomjs
    page.onError = function(msg, trace) {
        var msgStack = ['ERROR: ' + msg];
        if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function(t) {
                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            });
        }
        // uncomment to log into the console 
        // console.error(msgStack.join('\n'));
    };

    page.open(url, function(status) {
        if(status !== 'success') {
            console.log('Unable to access network');
            pageloads = false;
            phantom.exit();
        }
        // list all the div.normalResultsBox links in the page
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
            var divs = page.evaluate(function() {
                $('a.boxedLink').remove(); // get rid of garbage links
                $('.inlineSmallHeader').remove(); // get rid of 'TEL'
                return [].map.call(document.querySelectorAll('div.normalResultsBox'), function(div) {
                    return div.innerText;
                });
            });
            
            
            for(i=0; i<divs.length; i++){ // loop over each div item
            //for(i=4; i<5; i++){
                if(divs[i].length == 0) { // if there's an empty div?
                    continue;
                }
                
                var splitdivs = divs[i].split("\n"); // split the lines of the div
                if(i < (divs.length-1)) { var splitdivs2 = divs[i+1].split("\n"); }
                // var zipadd, zipadd2;
                for(x=0; x<splitdivs.length; x++){ //go through and delete empty array items
                    if(splitdivs[x].length < 2){
                        splitdivs.splice(x, 1);
                        if (splitdivs2) {splitdivs2.splice(x, 1);}
                        continue;
                        //console.log("spliced!");
                    }
                }
                
                splitdivs = splitAddress(splitdivs); // split the address part of the div
                if (splitdivs2) { splitdivs2 = splitAddress(splitdivs2); }

                splitdivs.splice(3, 0, ""); // add a blank field in 4th position
                if (splitdivs2) {splitdivs2.splice(3, 0, ""); // add a blank field in 4th position}

                // if(splitdivs[1].indexOf('〒') == 0){
                //     zipadd = splitdivs[1].split("　").join(",");
                //     splitdivs.splice(1, 1, zipadd);
                //     if(i < (divs.length-1)){
                //         splitdivs2 = divs[i+1].split("\n");
                //         zipadd2 = splitdivs2[1].split("　").join(",");
                //         splitdivs2.splice(1, 1, zipadd2);
                //     }
                // } else if(splitdivs[2].indexOf('〒') == 0){
                //     zipadd = splitdivs[2].split("　").join(",");
                //     splitdivs.splice(1, 2, zipadd);
                //     if(i < (divs.length-1)){
                //         splitdivs2 = divs[i+1].split("\n");
                //         zipadd2 = splitdivs2[1].split("　").join(",");
                //         splitdivs2.splice(1, 1, zipadd2);
                //     }
                // }
                
                //for(y=0; x<splitdivs.length; x++){
                    splitdivs[1] = replacePostSign(splitdivs[1]);
                    if (splitdivs2) {splitdivs2[1] = replacePostSign(splitdivs2[1]);}

                    //  if(splitdivs[1].indexOf('〒') == 0) {
                    //     splitdivs[1] = splitdivs[1].replace( /^〒/, '' );
                    //     if (i < (divs.length-1)) {splitdivs2[1] = splitdivs[1].replace( /^〒/, '' )};
                    //  } else if(splitdivs[2].indexOf('〒') == 0){  
                    //     splitdivs[2] = splitdivs[2].replace( /^〒/, '' );
                    //     //zipadd = splitdivs[2].split(" ").join(",");
                    //     splitdivs.splice(1, 1, splitdivs[2]);
                    //     splitdivs.splice(2, 1);
                    //     if (i < (divs.length-1) && splitdivs2[2].indexOf('〒') == 0) {
                    //         splitdivs2[2] = splitdivs2[2].replace( /^〒/, '' );
                    //         //zipadd2 = splitdivs2[2].split(" ").join(",");
                    //         splitdivs2.splice(1, 1, splitdivs2[2]);
                    //         splitdivs2.splice(2, 1);
                    //     } else {splitdivs2[1] = splitdivs[1].replace( /^〒/, '' )};
                        
                    // }
                //}
                
                
                // if (i < (divs.length-1)) { // look for fax numbers in duplicate addresses
                if (splitdivs2) { // look for fax numbers in duplicate addresses
                    // if the name and address are the same
                    if(splitdivs[0] == splitdivs2[0] && splitdivs[1] == splitdivs2[1]){
                        if(splitdivs2[2].indexOf('F') == 0 && splitdivs[2].indexOf('F') == 0){ // if there's a fax number in the duplicate entry
                            //splitdivs2[2] = splitdivs2[2].replace( /^F専 /, '' );
                            splitdivs[3] = splitdivs[2] + '/' + splitdivs2[2]; // put the fax number in the main entry
                            
                        } else if(splitdivs2[2].indexOf('F') == 0){ // if there's a fax number in the duplicate entry
                            //splitdivs2[2] = splitdivs2[2].replace( /^F専 /, '' );
                            splitdivs[3] = splitdivs2[2]; // put the fax number in the main entry
                            
                        } else if(splitdivs[2].indexOf('F') == 0){
                            //splitdivs[2] = splitdivs[2].replace( /^F専 /, '' );
                            var tempdiv = splitdivs[2];
                            // splitdivs[2] = splitdivs2[2];
                            splitdivs[3] = tempdiv;
                            splitdivs[2] = splitdivs2[2];
                        } else {
                            splitdivs[2] = splitdivs[2] + '/' + splitdivs2[2]
                        }
                        divs[i+1]=""; // delete the duplicate entry in the actual divs array
                    } else if(splitdivs[2].indexOf('F') == 0){ // if not duplicate, and a fax number
                        //splitdivs[2] = splitdivs[2].replace( /F専 /, '' );
                        splitdivs[3] = splitdivs[2];
                        splitdivs[2] = '';
                    }
                var temp = splitdivs[5];
                splitdivs[5] = splitdivs[4];
                splitdivs[4] = temp;
                }

                //if('(代) 086-226-0711'.indexOf('代') == 1){
                  //  console.log('(代) 086-226-0711'.replace( /^\(代\) /, '' ));   
                //} 
                console.log(splitdivs.join(','));
                //console.log('rock!');
            }
        }
            //console.log(arr.join(','));
            //console.log(divs.join('rock!\n'));
            // 
            // page.close;
            phantom.exit();
        });    
    });
    
// ct++;
// }
