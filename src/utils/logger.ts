export const DEBUG = false;

type LoggerTags = 'API' | 'LOG' | 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | string;

const TagStyleDecorator = {
  API: [
    'color: white',
    'background: black',
    'font-size: 20px',
    'border: 1px solid blue',
    'padding: 10px',
  ].join(';'),

  LOG: [
    'color: white',
    'background: black',
    'font-size: 20px',
    'border: 1px solid yellow',
    'padding: 10px',
  ].join(';'),

  INFO: [
    'color: white',
    'background: black',
    'font-size: 20px',
    'border: 1px solid yellow',
    'padding: 10px',
  ].join(';'),

  DEBUG: [
    'color: white',
    'background: black',
    'font-size: 20px',
    'border: 1px solid white',
    'padding: 10px',
  ].join(';'),

  WARN: [
    'color: white',
    'background: yellow',
    'font-size: 20px',
    'border: 1px solid white',
    'padding: 10px',
  ].join(';'),

  ERROR: [
    'color: white',
    'background: black',
    'font-size: 20px',
    'border: 3px solid red',
    'padding: 10px',
  ].join(';'),
};

const createLogger =
  (tag: LoggerTags = 'INFO') =>
  (message: string = '', ...rest) => {
    if (!DEBUG) return;
    if (!rest) return;
    if (
      Array.isArray(rest) &&
      rest.length === 1 &&
      typeof rest[0] === 'string'
    ) {
      console.log(
        '%c[%s]%s%s',
        TagStyleDecorator[tag],
        tag.toString(),
        message,
        rest[0] ?? '',
      );
    } else {
      console.log(
        '%c[%s]%s%O',
        TagStyleDecorator[tag],
        tag.toString(),
        message,
        rest[0] ?? {},
      );
    }
  };

export default createLogger;
