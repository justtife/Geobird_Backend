export default interface DbInterface {
    uri: string;
    pool: Record<string,string|number>
}