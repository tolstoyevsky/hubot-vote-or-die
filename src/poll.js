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
//   !poll question?, option 1, option 2 - builds a poll
//

module.exports = function (robot) {
    const uuid4 = require('uuidv4');

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
            ':keycap_ten:',
            ':keycap_asterisk:',
        ];

        const title = res.match[1];

        let options = [];

        matches = res.match[2].split(',');
        if (matches.length < 2) {
            res.send('Provide more than one option.');
            return;
        }

        if (matches.length > emojis.length) {
            res.send(`The maximum number of options is limited to ${emojis.length}.`);
            return;
        }

        for (const match of matches) {
            const trimmed = match.trim();
            if (trimmed) {
                options.push(`${emojis[options.length]} ${trimmed}`);
            }
        }

        var msg = {};
        msg.msg = '_Please vote using reactions_';
        msg._id = uuid4();
        msg.attachments = [
            {
                color: '#0000DD',
                title: title,
                text: options.join('\n')
            }
        ];

        res.send(msg);

        (async function(msgId, emojis, optionsNumber) {
            const delay = (ms) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve()
                    }, ms)
                })
            }

            // Wait till the message is in the channel.
            // TODO: probably there is a better approach how to achieve this.
            await delay(5000);

            for (let i = 0; i < optionsNumber; i++) {
                robot.adapter.callMethod('setReaction', emojis[i], msgId);

                await delay(1000);
            }
        })(msg._id, emojis, options.length);
    });
};

