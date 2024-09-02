 using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;
using A2_jji134.Models;
using System.Threading.Tasks;
using System.Text;

namespace A2_jji134.Helper
{
    public class CalendarOutputFormatter : TextOutputFormatter {
        public CalendarOutputFormatter(){
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/calendar"));
            SupportedEncodings.Add(Encoding.UTF8);
        }
        public override Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            Event newEvent = (Event) context.Object;
            StringBuilder builder = new StringBuilder();
            builder.AppendLine("BEGIN:VCALENDAR");
            builder.AppendLine("VERSION:2.0");
            builder.AppendLine("PRODID:-jji134");
            builder.AppendLine("BEGIN:VEVENT");
            builder.AppendLine($"UID:{newEvent.Id}");
            string dateNow = DateTime.UtcNow.ToString("yyyyMMddTHHmmssZ");
            builder.AppendLine($"DTSTAMP:{dateNow}");
            builder.AppendLine($"DTSTART:{newEvent.Start}");
            builder.AppendLine($"DTEND:{newEvent.End}");
            builder.AppendLine($"SUMMARY:{newEvent.Summary}");
            builder.AppendLine($"DESCRIPTION:{newEvent.Description}");
            builder.AppendLine($"LOCATION:{newEvent.Location}");
            builder.AppendLine("END:VEVENT");
            builder.AppendLine("END:VCALENDAR");

            string outString = builder.ToString();
            byte[] outBytes = selectedEncoding.GetBytes(outString);
            var response = context.HttpContext.Response.Body;
            return response.WriteAsync(outBytes, 0, outBytes.Length);
        }
    }
}
