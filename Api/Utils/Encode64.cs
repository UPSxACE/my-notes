using System.Text;

namespace Utils;

// By Chat GPT
public static class Encode64
{
    public static string EncodeToBase64(string plainText)
    {
        // Convert the plain text to a byte array
        byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

        // Convert the byte array to a Base64 encoded string
        return Convert.ToBase64String(plainTextBytes);
    }

    public static string DecodeFromBase64(string base64EncodedData)
    {
        // Convert the Base64 encoded string to a byte array
        byte[] base64EncodedBytes = Convert.FromBase64String(base64EncodedData);

        // Convert the byte array back to a plain text string
        return Encoding.UTF8.GetString(base64EncodedBytes);
    }
    public static string EncodeIntToBase64(int number)
    {
        byte[] intBytes = BitConverter.GetBytes(number);
        return Convert.ToBase64String(intBytes);
    }

    public static int DecodeBase64ToInt(string base64EncodedData)
    {
        byte[] intBytes = Convert.FromBase64String(base64EncodedData);
        return BitConverter.ToInt32(intBytes, 0);
    }
    public static string EncodeDateTimeToBase64(DateTime dateTime)
    {
        long dateTimeTicks = dateTime.Ticks;
        byte[] dateTimeBytes = BitConverter.GetBytes(dateTimeTicks);
        return Convert.ToBase64String(dateTimeBytes);
    }

    public static DateTime DecodeBase64ToDateTime(string base64EncodedData)
    {
        byte[] dateTimeBytes = Convert.FromBase64String(base64EncodedData);
        long dateTimeTicks = BitConverter.ToInt64(dateTimeBytes, 0);
        return new DateTime(dateTimeTicks);
    }
}