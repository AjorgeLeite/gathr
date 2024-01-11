import { render } from "@testing-library/react";
import { getServerSideProps } from "../pages/events";

jest.mock("axios");

describe("EventsPage", () => {
  it("should get server-side props", async () => {
    const mockedEvents = [
      {
        id: 1,
        created_at: 1639881900,
        name: "Event Title",
        description: "Event Description"
      },
    ];
    jest.spyOn(require("axios"), "get").mockResolvedValue({
      data: mockedEvents,
    });

    const context: any = {
      req: {
        headers: {
          cookie: "authToken=yourAuthToken",
        },
        cookies: {} as any,
        aborted: false,
        httpVersion: "1.1",
        httpVersionMajor: 1,
        httpVersionMinor: 1,
        complete: true,
        url: "/",
        method: "GET",
        connection: {} as any,
        socket: {} as any,
        headersDistinct: {} as any,
        rawHeaders: [] as any[],
        trailersDistinct: {} as any,
        rawTrailers: [] as any[],
        destroy: () => {},
        readableAborted: false,
      },
      res: {} as any,
      query: {} as any,
      resolvedUrl: "",
    };

    const result = await getServerSideProps(context);

    const { props } = result as any;

    expect(props).toEqual({ events: mockedEvents });
  });
});
