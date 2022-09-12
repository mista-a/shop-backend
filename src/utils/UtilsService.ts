export class UtilsService {
  static urlToTitleCase = (url: string) => {
    const text = url
      .split('-')
      .map(
        (name) =>
          name.substring(1, 1) + name[0].toUpperCase() + name.substring(1),
      )
      .join(' ');
    return text;
  };
}
