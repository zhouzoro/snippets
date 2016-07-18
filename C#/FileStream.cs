using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.IO;

namespace ConsoleApplication1
{
    class Program
    {
        static void WriteFile(string Filename)
        {
            FileStream fs = new FileStream(Filename, FileMode.Create, FileAccess.Write);

            if (fs.CanWrite)
            {
                byte[] buffer = Encoding.ASCII.GetBytes("Hello World");
                fs.Write(buffer, 0, buffer.Length);
            }

            fs.Flush();
            fs.Close();
        }

        static void ReadFile(string Filename)
        {
            FileStream fs = new FileStream(Filename, FileMode.Open, FileAccess.Read);

            if (fs.CanRead)
            {
                byte[] buffer = new byte[fs.Length];
                int bytesread = fs.Read(buffer, 0, buffer.Length);

                Console.WriteLine(Encoding.ASCII.GetString(buffer, 0, bytesread));
            }

            fs.Close();
        }

        static void Main(string[] args)
        {
            string Filename = @"E:\test\Doc.txt";

            WriteFile(Filename);

            ReadFile(Filename);

            Console.Read();
        }
    }
}
