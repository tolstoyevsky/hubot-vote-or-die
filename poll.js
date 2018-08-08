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
//   !poll question?, option 1, option 2
//

module.exports = function (robot) {

    const route = new RegExp(/^!poll ([^,]+),(.*)$/g);
        
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

        const title = res.match[1];

        let options = [];

        matches = res.match[2].split(',');
        for (var key in matches) {
            if (matches.hasOwnProperty(key)) {
                const trimmed = matches[key].trim();
                if (trimmed) {
                    options.push(emojis[(options.length + 1)] + ' ' + trimmed);
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
