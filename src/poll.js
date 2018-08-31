// Description:
//   Poll_bot
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
        
    robot.hear(route.source, async (res) => {

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

        // The object which represents a poll message.
        let msg = {};

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

        // Compose and send the poll message (containing the question and options).
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

        const delay = (ms) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve()
                }, ms)
            })
        }

        const retry = (retries, fn) =>
            fn().catch(async (err) => {
                if (retries > 1) {
                    retry(retries - 1, fn);

                    await delay(1000);
                } else {
                    Promise.reject(err);
                }
            });

        // Wait till the message is in the channel.
        // TODO: probably there is a better approach how to achieve this.
        await delay(5000);

        for (let i = 0; i < options.length; i++) {
            retry(3, () => {return robot.adapter.callMethod('setReaction', emojis[i], msg._id)});

            await delay(1000);
        }
    });
};

