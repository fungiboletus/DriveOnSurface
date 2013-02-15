using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using Microsoft.Surface;
using Microsoft.Surface.Core;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Audio;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.GamerServices;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework.Media;
using System.Threading;
using System.Net;
using Newtonsoft.Json;
using System.IO;
using Newtonsoft.Json.Linq;

namespace DriveOnSurface
{
    /// <summary>
    /// This is the main type for your application.
    /// </summary>
    public class App1 : Microsoft.Xna.Framework.Game
    {
        private readonly GraphicsDeviceManager graphics;
        private SpriteBatch spriteBatch;

        private TouchTarget touchTarget;
        private Color backgroundColor = new Color(0, 0, 0);
        private bool applicationLoadCompleteSignalled;

        private UserOrientation currentOrientation = UserOrientation.Bottom;
        private Matrix screenTransform = Matrix.Identity;

        /* ============== Les objets du jeu ============= */
        // Les objets dessinables.
        Dictionary<string, IDrawableObject> DrawableObjects = new Dictionary<string, IDrawableObject>();

        SpriteFont spriteFont;

        // Redirige la console dans un fichier de log (meilleures performances).
        OutToFile redir = new OutToFile("log.txt");

        // L'url où tourne le serveur node.js
        String serverURL;

        bool fullScreen = false;

        // Valeur des tags posés sur la table.
        Dictionary<String, TouchPoint> TagValues = new Dictionary<string, TouchPoint>();

        // les différentes phases de jeu
        enum GameState { menu, play, waiting }

        // la phase de jeu en cours
        GameState CurrentState = GameState.menu;

        // le circuit sélectionné
        Background.Track selectedTrack = Background.Track.Menu;

        bool debug = false;
        // pour afficher les bordures lors du debug.
        List<RectangleOverlay> rects = new List<RectangleOverlay>();

        int scale = 16; // echelle mètres * scale -> pixels

        // web clien responsable des communications avec le serveur.
        WebClient wc = new WebClient();

        /// <summary>
        /// The target receiving all surface input for the application.
        /// </summary>
        protected TouchTarget TouchTarget
        {
            get { return touchTarget; }
        }

        /// <summary>
        /// Default constructor.
        /// </summary>
        public App1()
        {
            graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";
        }

        #region Initialization

        /// <summary>
        /// Moves and sizes the window to cover the input surface.
        /// </summary>
        private void SetWindowOnSurface()
        {
            System.Diagnostics.Debug.Assert(Window != null && Window.Handle != IntPtr.Zero,
                "Window initialization must be complete before SetWindowOnSurface is called");
            if (Window == null || Window.Handle == IntPtr.Zero)
                return;

            // Get the window sized right.
            Program.InitializeWindow(Window);
            // Set the graphics device buffers.
            graphics.PreferredBackBufferWidth = 1920;
            graphics.PreferredBackBufferHeight = 1080;
            graphics.IsFullScreen = fullScreen;

            graphics.ApplyChanges();
            // Make sure the window is in the right location.
            Program.PositionWindow();
        }

        /// <summary>
        /// Initializes the surface input system. This should be called after any window
        /// initialization is done, and should only be called once.
        /// </summary>
        private void InitializeSurfaceInput()
        {
            System.Diagnostics.Debug.Assert(Window != null && Window.Handle != IntPtr.Zero,
                "Window initialization must be complete before InitializeSurfaceInput is called");
            if (Window == null || Window.Handle == IntPtr.Zero)
                return;
            System.Diagnostics.Debug.Assert(touchTarget == null,
                "Surface input already initialized");
            if (touchTarget != null)
                return;

            // Create a target for surface input.
            touchTarget = new TouchTarget(Window.Handle, EventThreadChoice.OnBackgroundThread);
            touchTarget.EnableInput();
        }

        #endregion

        #region Overridden Game Methods

        /// <summary>
        /// Allows the app to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            // TODO: Add your initialization logic here   
            Console.WriteLine("Initialisation du jeu");

            loadConfig();

            Background bBackground = new Background(new Vector2(0, 0), Background.Track.Menu);
            DrawableObjects.Add("background", bBackground);

            IsMouseVisible = true; // easier for debugging not to "lose" mouse
            SetWindowOnSurface();
            InitializeSurfaceInput();

            // Set the application's orientation based on the orientation at launch
            currentOrientation = ApplicationServices.InitialOrientation;

            // Subscribe to surface window availability events
            ApplicationServices.WindowInteractive += OnWindowInteractive;
            ApplicationServices.WindowNoninteractive += OnWindowNoninteractive;
            ApplicationServices.WindowUnavailable += OnWindowUnavailable;

            // Setup the UI to transform if the UI is rotated.
            // Create a rotation matrix to orient the screen so it is viewed correctly
            // when the user orientation is 180 degress different.
            Matrix inverted = Matrix.CreateRotationZ(MathHelper.ToRadians(180)) *
                       Matrix.CreateTranslation(graphics.GraphicsDevice.Viewport.Width,
                                                 graphics.GraphicsDevice.Viewport.Height,
                                                 0);

            if (currentOrientation == UserOrientation.Top)
            {
                screenTransform = inverted;
            }

            base.Initialize();
        }

        /// <summary>
        /// LoadContent will be called once per app and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent()
        {
            // Create a new SpriteBatch, which can be used to draw textures.
            spriteBatch = new SpriteBatch(GraphicsDevice);

            // TODO: use this.Content to load your application content here

            foreach (IDrawableObject DObj in DrawableObjects.Values)
            {
                DObj.LoadContent(this.Content);
            }

            spriteFont = Content.Load<SpriteFont>("SpriteFont1");
        }

        /// <summary>
        /// UnloadContent will be called once per app and is the place to unload
        /// all content.
        /// </summary>
        protected override void UnloadContent()
        {
            // TODO: Unload any non ContentManager content here
        }

        /// <summary>
        /// Allows the app to run logic such as updating the world,
        /// checking for collisions, gathering input and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime)
        {
            if (ApplicationServices.WindowAvailability != WindowAvailability.Unavailable)
            {
                if (ApplicationServices.WindowAvailability == WindowAvailability.Interactive)
                {
                    // TODO: Process touches, 
                    // use the following code to get the state of all current touch points.
                    // ReadOnlyTouchPointCollection touches = touchTarget.GetState();

                    ReadOnlyTouchPointCollection touches = touchTarget.GetState();
                    if (CurrentState == GameState.play) // si on est en cours de partie
                    {
                        refreshGameState(); // on rafraichit la liste des objets à afficher

                        if (DrawableObjects.ContainsKey("greenlights")) // affichage des feux de départ
                        {
                            GreenLights gl = (GreenLights)DrawableObjects["greenlights"];
                            if (gameTime.TotalGameTime.Seconds > gl.last_update + 1) // ils disparaissent au bout d'une seconde
                            {
                                DrawableObjects.Remove("greenlights");
                            }
                        }

                        List<String> detectedTags = new List<string>();

                        foreach (var t in touches) // création de la liste des tags posés
                        {
                            if (t.IsTagRecognized)
                            {
                                detectedTags.Add(t.Tag.Value.ToString());
                                if (!TagValues.ContainsKey(t.Tag.Value.ToString()))
                                {
                                    TagValues.Add(t.Tag.Value.ToString(), t);
                                    // envoi de l'évent au serveur
                                    string data = wc.DownloadString(serverURL + "put_tag/"
                                        + t.Tag.Value.ToString() + "/" + t.CenterX / scale + "/" + t.CenterY / scale + "/" + t.Orientation);

                                }
                            }
                            else //  un doigt ou un blob
                            {
                                string data = wc.DownloadString(serverURL + "blob/"
                                    + t.CenterX / scale + "/" + t.CenterY / scale);
                            }
                        }

                        List<string> tagsToDelete = new List<string>();

                        foreach (String tagV in TagValues.Keys) // et on supprime ceux qui ont été enlevés
                        {
                            if (!detectedTags.Contains(tagV))
                            {
                                tagsToDelete.Add(tagV);
                                string data = wc.DownloadString(serverURL + "remove_tag/"
                                    + tagV);
                            }
                        }

                        foreach (String tagV in tagsToDelete)
                        {
                            TagValues.Remove(tagV);
                        }

                    }
                    else if (CurrentState == GameState.menu) // si on est dans le menu.
                    {
                        bool isTrackSelected = false;
                        foreach (var t in touches)
                        {
                            //spriteBatch.DrawString(spriteFont, "x : " + t.X + " y : " + t.Y, new Vector2(t.X, t.Y), Color.Black);
                            if (t.Y > 200 && t.Y < 400) //Première ligne
                            {
                                if (t.X > 100 && t.X < 600) // 1ere colonne
                                {
                                    selectedTrack = Background.Track.Classic;
                                    isTrackSelected = true;
                                }
                                else if (t.X > 700 && t.X < 1200)
                                {
                                    selectedTrack = Background.Track.RainbowRoad;
                                    isTrackSelected = true;
                                }
                                else if (t.X > 1300 && t.X < 1850)
                                {
                                    selectedTrack = Background.Track.City;
                                    isTrackSelected = true;
                                }
                            }
                            else if (t.Y > 600 && t.Y < 875) //deuxième ligne
                            {
                                if (t.X > 100 && t.X < 600) // 1ere colonne
                                {
                                }
                                else if (t.X > 700 && t.X < 1200)
                                {
                                }
                                else if (t.X > 1300 && t.X < 1850)
                                {
                                }
                            }
                        }

                        if (isTrackSelected) // si le joueur à cliqué sur un circuit.
                        {
                            CurrentState = GameState.waiting;
                            Background trackBackground = new Background(new Vector2(0, 0), selectedTrack);
                            trackBackground.LoadContent(this.Content);
                            DrawableObjects["background"] = trackBackground;
                            //envoyer circuit choisi au serveur. (/track/nomDuCircuit)
                            string trackName = "none";
                            switch (selectedTrack)
                            {
                                case Background.Track.Classic:
                                    trackName = "classic";
                                    break;
                                case Background.Track.RainbowRoad:
                                    trackName = "rainbow";
                                    break;
                                case Background.Track.City:
                                    trackName = "city";
                                    break;
                            }
                            string data = wc.DownloadString(serverURL + "track/" + trackName);
                        }
                    }
                    else if (CurrentState == GameState.waiting) // état en attente du départ (après sélection du circuit et avant  le départ)
                    {
                        refreshGameState();

                        GreenLights gl;

                        if (DrawableObjects.ContainsKey("greenlights"))
                        {
                            gl = (GreenLights)DrawableObjects["greenlights"];
                        }
                        else
                        {
                            Console.WriteLine("new lights");
                            gl = new GreenLights();
                            gl.LoadContent(this.Content);
                            DrawableObjects.Add("greenlights", gl);
                        }

                        switch (gl.currentState) // mise à jour des feux de départ toute les secondes.
                        {
                            case GreenLights.GLState.Waiting:
                                foreach (var t in touches)
                                {
                                    if (t.Y > 220 && t.Y < 860 && t.X > 640 && t.X < 1280) //clic sur le drapeau
                                    {
                                        gl.currentState = GreenLights.GLState.R3;
                                        gl.last_update = gameTime.TotalGameTime.Seconds;
                                    }
                                }
                                break;
                            case GreenLights.GLState.R3:
                                if (gameTime.TotalGameTime.Seconds > gl.last_update + 1)
                                {
                                    gl.currentState = GreenLights.GLState.R2;
                                    gl.last_update = gameTime.TotalGameTime.Seconds;
                                }
                                break;
                            case GreenLights.GLState.R2:
                                if (gameTime.TotalGameTime.Seconds > gl.last_update + 1)
                                {
                                    gl.currentState = GreenLights.GLState.R1;
                                    gl.last_update = gameTime.TotalGameTime.Seconds;
                                }
                                break;
                            case GreenLights.GLState.R1:
                                if (gameTime.TotalGameTime.Seconds > gl.last_update + 1)
                                {
                                    gl.currentState = GreenLights.GLState.GO;
                                    gl.last_update = gameTime.TotalGameTime.Seconds;
                                    CurrentState = GameState.play;
                                    string data = wc.DownloadString(serverURL + "start");
                                }
                                break;
                        }

                    }

                }

                // TODO: Add your update logic here

            }

            base.Update(gameTime);
        }

        /// <summary>
        /// This is called when the app should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            if (!applicationLoadCompleteSignalled)
            {
                // Dismiss the loading screen now that we are starting to draw
                ApplicationServices.SignalApplicationLoadComplete();
                applicationLoadCompleteSignalled = true;
            }

            //TODO: Rotate the UI based on the value of screenTransform here if desired

            GraphicsDevice.Clear(backgroundColor);

            //TODO: Add your drawing code here            

            spriteBatch.Begin(SpriteSortMode.BackToFront, BlendState.AlphaBlend);

            //Console.WriteLine(gameTime.ElapsedGameTime);


            foreach (IDrawableObject DObj in DrawableObjects.Values) // on dessine tout les objets dessinables
            {
                DObj.Draw(this.spriteBatch);
                if (DObj is IMovableObject)
                {
                    //Console.WriteLine("==========================\nDraw object at " + ((IMovableObject)DObj).getPosition().Y);
                }
            }

            foreach (RectangleOverlay r in rects) // on dessine les bordures du circuit (la liste est vide si !debug)
            {
                r.Draw(this.spriteBatch);
                //Console.WriteLine("drawing rect at : " + r.dummyRectangle.Center);
            }

            spriteBatch.End();

            //TODO: Avoid any expensive logic if application is neither active nor previewed

            base.Draw(gameTime);
        }

        #endregion

        #region Application Event Handlers

        /// <summary>
        /// This is called when the user can interact with the application's window.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnWindowInteractive(object sender, EventArgs e)
        {
            //TODO: Enable audio, animations here

            //TODO: Optionally enable raw image here
        }

        /// <summary>
        /// This is called when the user can see but not interact with the application's window.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnWindowNoninteractive(object sender, EventArgs e)
        {
            //TODO: Disable audio here if it is enabled

            //TODO: Optionally enable animations here
        }

        /// <summary>
        /// This is called when the application's window is not visible or interactive.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnWindowUnavailable(object sender, EventArgs e)
        {
            //TODO: Disable audio, animations here

            //TODO: Disable raw image if it's enabled
        }

        #endregion

        #region IDisposable

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                // Release managed resources.
                IDisposable graphicsDispose = graphics as IDisposable;
                if (graphicsDispose != null)
                {
                    graphicsDispose.Dispose();
                }
                if (touchTarget != null)
                {
                    touchTarget.Dispose();
                    touchTarget = null;
                }
            }

            // Release unmanaged Resources.

            //redir.Dispose();

            // Set large objects to null to facilitate garbage collection.

            base.Dispose(disposing);
        }

        #endregion

        /**
         *  Récupère les objets sur le serveur et les ajoute à la liste des objets dessinables.
         **/
        public void refreshGameState()
        {

            WebClient w = wc;
            {
                var json_data = string.Empty;
                // attempt to download JSON data as a string
                try
                {
                    json_data = w.DownloadString(serverURL + "state");

                    JObject o = JObject.Parse(json_data);

                    List<string> objectsIdToKeep = new List<string>();
                    objectsIdToKeep.Add("background");
                    objectsIdToKeep.Add("greenlights");

                    try
                    {
                        // recuperation des joueurs
                        foreach (JObject player in o["joueurs"])
                        {

                            objectsIdToKeep.Add((string)player["pseudo"]);
                            double xCenter = (double)player["position_x"] * scale;
                            double yCenter = (double)player["position_y"] * scale;
                            double angle = (double)player["angle"];
                            double width = 1.8 * scale;
                            double height = 2.5 * scale;
                            //double xUL = xCenter + ( width / 2 ) * Math.Cos(angle) - ( height / 2 ) * Math.Sin(angle);
                            //double yUL = yCenter + ( height / 2 ) * Math.Cos(angle)  + ( width / 2 ) * Math.Sin(angle);
                            double xUL = xCenter;
                            double yUL = yCenter;


                            if (DrawableObjects.Keys.Contains((string)player["pseudo"]))
                            {
                                //Console.WriteLine("Updating car position : " + player["pseudo"] + "( " + (int)player["position_x"] + ", " + (int)player["position_y"] + ")");
                                Car car = (Car)DrawableObjects[(string)player["pseudo"]];
                                car.setPosition((int)xUL, (int)yUL);
                                car.setRotation((float)angle);
                            }
                            else
                            {
                                //Console.WriteLine("Creating new car : " + pseudo);
                                Car.CColor CarColor;
                                switch ((string)player["color"])
                                {
                                    case "Blue":
                                        CarColor = Car.CColor.Blue;
                                        break;
                                    case "Yellow":
                                        CarColor = Car.CColor.Yellow;
                                        break;
                                    case "Green":
                                        CarColor = Car.CColor.Green;
                                        break;
                                    case "Red":
                                        CarColor = Car.CColor.Red;
                                        break;
                                    default:
                                        CarColor = Car.CColor.None;
                                        break;
                                }
                                if (CarColor != Car.CColor.None)
                                {
                                    Car car = new Car((string)player["pseudo"], CarColor);
                                    car.LoadContent(this.Content);
                                    car.setPosition((int)xUL, (int)yUL);
                                    car.setRotation((float)angle);
                                    DrawableObjects.Add((string)player["pseudo"], car);
                                    //Console.WriteLine("new Car : " + car.getPosition());
                                }
                            }
                        }
                    }
                    catch { }

                    

                    if (debug)
                    {
                        try
                        {
                            foreach (JObject prop in o["props"])
                            {

                                int width = ((int)prop["size"][0] * scale);
                                int h = ((int)prop["size"][1] * scale);
                                int x = (int)prop["position"][0] * scale - width / 2;
                                int y = (int)prop["position"][1] * scale - h / 2;
                                float angle = (float)prop["angle"];

                                RectangleOverlay r = new RectangleOverlay(new Rectangle(x, y, width, h), Color.White, this, angle);
                                r.Initialize();
                                r.LoadContent();
                                rects.Add(r);
                                //Console.WriteLine("newRect : " + x + ", " + y);
                            }

                            debug = false;
                        }
                        catch { }
                    }

                    //bonus
                    try
                    {
                        foreach (JObject bonus in o["bonus"])
                        {

                            string type = (string)bonus["type"];
                            string id = (string)bonus["id"];
                            double x = (double)bonus["position_x"] * scale;
                            double y = (double)bonus["position_y"] * scale;
                            float angle = (float)bonus["angle"];

                            objectsIdToKeep.Add(id);

                            Bonus b;

                            if (DrawableObjects.ContainsKey(id))
                            {
                                b = (Bonus)DrawableObjects[id];
                                b.setPosition((int)x, (int)y);
                                b.setRotation(angle);
                            }
                            else
                            {
                                Bonus.BType btype;

                                switch (type)
                                {
                                    case "nails":
                                        btype = Bonus.BType.Clous;
                                        break;
                                    case "train":
                                        btype = Bonus.BType.Train;
                                        break;
                                    case "rabbit":
                                        btype = Bonus.BType.Granny;
                                        break;
                                    default:
                                        btype = Bonus.BType.Unknown;
                                        break;
                                }

                                b = new Bonus(id, btype);
                                b.LoadContent(this.Content);
                                b.setPosition((int)x, (int)y);
                                b.setRotation(angle);

                                DrawableObjects.Add(id, b);

                            }

                        }
                    }
                    catch { }

                    // suppression des objets qui n'existent plus

                    List<String> objectsToRemove = new List<string>();
                    foreach (string id in DrawableObjects.Keys)
                    {
                        if (!objectsIdToKeep.Contains(id))
                        {
                            objectsToRemove.Add(id);
                        }
                    }

                    foreach (string id in objectsToRemove)
                    {
                        DrawableObjects.Remove(id);
                    }


                    /*Console.WriteLine("============================Start refresh============================");
                    while (reader.Read())
                    {
                        if (reader.Value != null)
                            Console.WriteLine("Token: {0}, Value: {1}", reader.TokenType, reader.Value);
                        else
                            Console.WriteLine("Token: {0}", reader.TokenType);
                    }
                    Console.WriteLine("============================END====================================");*/



                }
                catch (Exception e) { Console.WriteLine(e.Message); }


            }
        }

        /**
         * Charge les paramètres depuis le fichier de config.
         */
        public void loadConfig()
        {
            try
            {
                using (StreamReader sr = new StreamReader("config.txt"))
                {
                    String line = sr.ReadToEnd();
                    JObject o = JObject.Parse(line);
                    serverURL = (string)o["server-url"];
                    fullScreen = (bool)o["full-screen"];
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("The config file could not be read:");
                Console.WriteLine(e.Message);
            }
        }
    }
}
