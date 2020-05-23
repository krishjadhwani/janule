import { Args, Command } from './types';

const COMMAND_STRING_PARSE_MAP = {
    '!addmeme': Command.AddMeme,
    '!getmemes': Command.GetMemes,
    '!roll': Command.Roll,
};

export const parseCommand = (message: string): { command?: Command; args?: Args } => {
    const [name, ...args] = message.split(' ');

    if (name in COMMAND_STRING_PARSE_MAP) {
        return { command: COMMAND_STRING_PARSE_MAP[name], args };
    }

    return {};
};