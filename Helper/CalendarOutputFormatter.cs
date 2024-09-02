// using Microsoft.AspNetCore.Mvc.Formatters;
// using Microsoft.Net.Http.Headers;
// using A2_jji134.Models;

// namespace A2_jji134.Helper
// {
//     public class CalendarOutputFormatter : TextOutputFormatter {
//         public VCardOutputFormatter(){
//             SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/vcard"));
//             SupportedEncodings.Add(Encoding.UTF8);
//         }
//         public override Task WriteResponseBodyAsync(OutputFormatterWriteContext context,
//         Encoding selectedEncoding)
//         {
//             CardOut card = (CardOut)context.Object;
//         }
//     }
// }