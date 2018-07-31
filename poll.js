// Description:
//   Poll_bot
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   !poll, "question?", "option 1", "option 2" 
//

module.exports = function (robot) {

    const route = new RegExp(/((["'])(?:(?=(\\?))\3.)*?\2)/g);
        
    robot.hear(route.source, function (res) {

        const emojis = [
            ':zero:',
            ':one:',
            ':two:',
            ':three:',
            ':four:',
            ':five:',
            ':six:',
            ':seven:',
            ':eight:',
            ':nine:',
            ':ten:'
        ];

        let title = '';
        let options = [];

        const reg = /([^,]+)/g;

        matches = res.match.input.match(reg);
        for (var key in matches) {
            if (matches.hasOwnProperty(key)) {
                if (key == 0) continue;
                else if (key == 1) {
                    title = matches[key].replace(/['"]+/g, '');
                }
                else if(key > 1){
                    options.push(emojis[(options.length + 1)] + ' ' + matches[key].replace(/['"]+/g, ''));
                }
            }
        }

        var msg = {};
        msg.msg = '_Please vote using reactions_';
        msg.attachments = [
                {
                    color: '#0000DD',
                    title: title,
                    text: options.join('\n')
                }
            ];

        return res.send(
            msg
        );

    });
};
